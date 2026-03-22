/**
 * HTTP client voor communicatie met EnvTree daemon
 */

export interface Secret {
  id: string;
  key: string;
  value: string;
  created_at: string;
  rotated_at: string;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  created_at: string;
}

/**
 * Client voor communicatie met de EnvTree daemon API
 */
export class EnvTreeClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Voeg een nieuwe secret toe
   */
  async addSecret(key: string, value: string): Promise<Secret> {
    const projectPath = await this.getCurrentProjectPath();
    
    const response = await fetch(`${this.baseUrl}/secrets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectPath,
        key,
        value
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as Secret;
  }

  /**
   * Haal alle secrets voor huidige project op
   */
  async getSecrets(): Promise<Secret[]> {
    const projectPath = await this.getCurrentProjectPath();
    
    const response = await fetch(
      `${this.baseUrl}/secrets?projectPath=${encodeURIComponent(projectPath)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as Secret[];
  }

  /**
   * Roteer een secret
   */
  async rotateSecret(key: string, newValue?: string): Promise<Secret> {
    const projectPath = await this.getCurrentProjectPath();
    
    const response = await fetch(`${this.baseUrl}/secrets/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectPath,
        newValue
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as Secret;
  }

  /**
   * Verwijder een secret
   */
  async deleteSecret(key: string): Promise<boolean> {
    const projectPath = await this.getCurrentProjectPath();
    
    const response = await fetch(`${this.baseUrl}/secrets/${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectPath
      })
    });

    return response.ok;
  }

  /**
   * Inject secrets in .env formaat
   */
  async injectSecrets(): Promise<string> {
    const projectPath = await this.getCurrentProjectPath();
    
    const response = await fetch(`${this.baseUrl}/inject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectPath
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json() as { content: string };
    return result.content;
  }

  /**
   * Haal alle projecten op
   */
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${this.baseUrl}/projects`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as Project[];
  }

  /**
   * Initialiseer een nieuw project
   */
  async initProject(name: string): Promise<Project> {
    const projectPath = await this.getCurrentProjectPath();
    
    const response = await fetch(`${this.baseUrl}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        projectPath
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as Project;
  }

  /**
   * Controleer of daemon beschikbaar is
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Haal huidige project pad op
   */
  private async getCurrentProjectPath(): Promise<string> {
    // Voor nu gebruiken we het eerste workspace folder
    // In de toekomst kunnen we dit uitbreiden met project selectie
    const workspaceFolders = await this.getWorkspaceFolders();
    
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error("Geen workspace folder gevonden");
    }

    return workspaceFolders[0].fsPath;
  }

  /**
   * Helper om workspace folders op te halen
   */
  private getWorkspaceFolders(): any[] {
    // Simulatie van vscode.workspace.workspaceFolders
    // In echte implementatie zou dit vscode API gebruiken
    return [];
  }
}
