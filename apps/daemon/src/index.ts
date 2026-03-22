import http from "http";
import url from "url";
import { VaultService, createVaultWithNewKey } from "@envtree/core";
import { homedir } from "os";
import fs from "fs";
import path from "path";

/**
 * Interface voor API requests
 */
interface ApiRequest {
  /** HTTP methode */
  method: string;
  /** URL pad */
  path: string;
  /** Query parameters */
  query: Record<string, string>;
  /** Request body */
  body?: any;
}

/**
 * Interface voor API responses */
interface ApiResponse {
  /** HTTP status code */
  status: number;
  /** Response data */
  data?: any;
  /** Error message */
  error?: string;
}

/**
 * Configuratie voor de daemon
 */
interface DaemonConfig {
  /** Poort voor de HTTP server */
  port: number;
  /** Master key voor encryptie */
  masterKey?: string;
  /** Database pad */
  dbPath?: string;
}

/**
 * HTTP Daemon voor EnvTree
 * Biedt een REST API voor secret management operaties
 */
class EnvTreeDaemon {
  private server: http.Server;
  private vaultService: VaultService;
  private port: number;

  constructor(config: DaemonConfig) {
    this.port = config.port;
    
    // Initialiseer vault service
    if (config.masterKey) {
      this.vaultService = new VaultService({
        masterKey: config.masterKey,
        dbPath: config.dbPath
      });
    } else {
      // Genereer nieuwe master key als deze niet bestaat
      const keyPath = path.join(homedir(), ".envtree", "master.key");
      
      if (fs.existsSync(keyPath)) {
        const masterKey = fs.readFileSync(keyPath, "utf8").trim();
        this.vaultService = new VaultService({
          masterKey,
          dbPath: config.dbPath
        });
      } else {
        const { service, masterKey } = createVaultWithNewKey(config.dbPath);
        this.vaultService = service;
        
        // Sla master key op
        fs.mkdirSync(path.dirname(keyPath), { recursive: true });
        fs.writeFileSync(keyPath, masterKey, "utf8");
        fs.chmodSync(keyPath, 0o600); // Alleen leesbaar voor eigenaar
      }
    }

    // Maak HTTP server
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
  }

  /**
   * Start de daemon server
   */
  start(): void {
    this.server.listen(this.port, () => {
      console.log(`🌳 EnvTree Daemon gestart op poort ${this.port}`);
      console.log(`📡 API beschikbaar op http://localhost:${this.port}`);
    });
  }

  /**
   * Stop de daemon server
   */
  stop(): void {
    this.server.close(() => {
      console.log("🛑 EnvTree Daemon gestopt");
    });
  }

  /**
   * Verwerk inkomende HTTP requests
   */
  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      // Parse request
      const parsedUrl = url.parse(req.url || "", true);
      const apiRequest: ApiRequest = {
        method: req.method || "GET",
        path: parsedUrl.pathname || "",
        query: parsedUrl.query as Record<string, string>
      };

      // Lees body voor POST/PUT requests
      if (req.method && ["POST", "PUT"].includes(req.method)) {
        apiRequest.body = await this.parseRequestBody(req);
      }

      // Route request
      const response = await this.routeRequest(apiRequest);
      
      // Stuur response
      this.sendResponse(res, response);
    } catch (error) {
      console.error("❌ Request error:", error);
      this.sendResponse(res, {
        status: 500,
        error: "Internal server error"
      });
    }
  }

  /**
   * Parse request body van stream
   */
  private parseRequestBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = "";
      
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      
      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (error) {
          reject(new Error("Invalid JSON in request body"));
        }
      });
      
      req.on("error", (error) => {
        reject(error);
      });
    });
  }

  /**
   * Route request naar juiste handler
   */
  private async routeRequest(req: ApiRequest): Promise<ApiResponse> {
    const { method, path, query } = req;

    // Health check endpoint
    if (path === "/health" && method === "GET") {
      return {
        status: 200,
        data: { status: "ok", version: "1.0.0" }
      };
    }

    // Project endpoints
    if (path === "/projects" && method === "GET") {
      const projects = this.vaultService.getProjects();
      return { status: 200, data: projects };
    }

    if (path === "/projects" && method === "POST") {
      const { name, projectPath } = req.body;
      if (!name || !projectPath) {
        return { status: 400, error: "Name en projectPath zijn verplicht" };
      }
      
      const project = this.vaultService.initProject(name, projectPath);
      return { status: 201, data: project };
    }

    // Secrets endpoints
    if (path === "/secrets" && method === "GET") {
      const { projectPath } = query;
      if (!projectPath) {
        return { status: 400, error: "projectPath query parameter is verplicht" };
      }
      
      const secrets = this.vaultService.getSecrets(projectPath);
      return { status: 200, data: secrets };
    }

    if (path === "/secrets" && method === "POST") {
      const { projectPath, key, value } = req.body;
      if (!projectPath || !key || !value) {
        return { status: 400, error: "projectPath, key en value zijn verplicht" };
      }
      
      const secret = this.vaultService.addSecret(projectPath, key, value);
      return { status: 201, data: secret };
    }

    if (path.startsWith("/secrets/") && method === "PUT") {
      const secretKey = path.replace("/secrets/", "");
      const { projectPath, newValue } = req.body;
      
      if (!projectPath) {
        return { status: 400, error: "projectPath is verplicht" };
      }
      
      const rotated = this.vaultService.rotateSecret(projectPath, secretKey, newValue);
      return { status: 200, data: rotated };
    }

    if (path.startsWith("/secrets/") && method === "DELETE") {
      const secretKey = path.replace("/secrets/", "");
      const { projectPath } = req.body;
      
      if (!projectPath) {
        return { status: 400, error: "projectPath is verplicht" };
      }
      
      const deleted = this.vaultService.deleteSecret(projectPath, secretKey);
      return { status: deleted ? 200 : 404, data: { deleted } };
    }

    // Inject endpoint
    if (path === "/inject" && method === "POST") {
      const { projectPath } = req.body;
      if (!projectPath) {
        return { status: 400, error: "projectPath is verplicht" };
      }
      
      const envContent = this.vaultService.exportForEnv(projectPath);
      return { status: 200, data: { content: envContent } };
    }

    // Onbekende route
    return {
      status: 404,
      error: "Endpoint niet gevonden"
    };
  }

  /**
   * Stuur HTTP response
   */
  private sendResponse(res: http.ServerResponse, response: ApiResponse): void {
    res.writeHead(response.status, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });

    if (response.error) {
      res.end(JSON.stringify({ error: response.error }));
    } else {
      res.end(JSON.stringify(response.data));
    }
  }
}

/**
 * Start de daemon met standaard configuratie
 */
function main(): void {
  const config: DaemonConfig = {
    port: parseInt(process.env.ENVTREE_PORT || "4848"),
    dbPath: process.env.ENVTREE_DB_PATH
  };

  const daemon = new EnvTreeDaemon(config);
  
  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Ontvang SIGINT, stop daemon...");
    daemon.stop();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n🛑 Ontvang SIGTERM, stop daemon...");
    daemon.stop();
    process.exit(0);
  });

  daemon.start();
}

// Start daemon als dit het main script is
if (require.main === module) {
  main();
}

export { EnvTreeDaemon, DaemonConfig };
