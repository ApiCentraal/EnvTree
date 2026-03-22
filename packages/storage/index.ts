import fs from "fs";
import path from "path";
import { homedir } from "os";

/**
 * Interface voor een project record
 */
export interface Project {
  /** Unieke project identifier */
  id: string;
  /** Project naam */
  name: string;
  /** Absoluut pad naar project */
  path: string;
  /** Aanmaakdatum */
  created_at: string;
}

/**
 * Interface voor een secret record
 */
export interface Secret {
  /** Unieke secret identifier */
  id: string;
  /** Referentie naar project */
  project_id: string;
  /** Secret key naam */
  key: string;
  /** Geëncrypteerde waarde */
  encrypted_value: string;
  /** Initialisatie vector */
  iv: string;
  /** Authenticatie tag */
  auth_tag: string;
  /** Aanmaakdatum */
  created_at: string;
  /** Laatste rotatie datum */
  rotated_at: string;
}

/**
 * Interface voor de database structuur
 */
export interface Database {
  /** Lijst van projecten */
  projects: Project[];
  /** Lijst van secrets */
  secrets: Secret[];
}

/**
 * Storage class voor lokale database operaties
 * Gebruikt JSON file voor eenvoudige, zero-dependency opslag
 */
export class Storage {
  private dbPath: string;
  private db: Database;

  constructor(dbPath?: string) {
    // Gebruik standaard pad in user home directory
    this.dbPath = dbPath || path.join(homedir(), ".envtree", "vault.db.json");
    this.ensureDbDirectory();
    this.db = this.loadDatabase();
  }

  /**
   * Zorgt ervoor dat de database directory bestaat
   */
  private ensureDbDirectory(): void {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Laad de database van schijf
   * @returns Database object
   */
  private loadDatabase(): Database {
    try {
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, "utf8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn("Database corrupt, maak nieuwe aan");
    }
    
    // Return nieuwe lege database als bestand niet bestaat of corrupt is
    return {
      projects: [],
      secrets: []
    };
  }

  /**
   * Sla de database op naar schijf
   */
  private saveDatabase(): void {
    const data = JSON.stringify(this.db, null, 2);
    fs.writeFileSync(this.dbPath, data, "utf8");
  }

  /**
   * Voeg een nieuw project toe
   * @param name Project naam
   * @param projectPath Project pad
   * @returns Aangemaakt project
   */
  addProject(name: string, projectPath: string): Project {
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      path: projectPath,
      created_at: new Date().toISOString()
    };

    this.db.projects.push(project);
    this.saveDatabase();
    return project;
  }

  /**
   * Haal project op basis van pad
   * @param projectPath Zoekpad
   * @returns Project of undefined
   */
  getProjectByPath(projectPath: string): Project | undefined {
    return this.db.projects.find(p => p.path === projectPath);
  }

  /**
   * Haal alle projecten op
   * @returns Lijst van projecten
   */
  getProjects(): Project[] {
    return [...this.db.projects];
  }

  /**
   * Voeg een nieuwe secret toe
   * @param projectId Project identifier
   * @param key Secret key
   * @param encryptedValue Geëncrypteerde waarde
   * @param iv Initialisatie vector
   * @param authTag Authenticatie tag
   * @returns Aangemaakte secret
   */
  addSecret(
    projectId: string,
    key: string,
    encryptedValue: string,
    iv: string,
    authTag: string
  ): Secret {
    const now = new Date().toISOString();
    const secret: Secret = {
      id: crypto.randomUUID(),
      project_id: projectId,
      key,
      encrypted_value: encryptedValue,
      iv,
      auth_tag: authTag,
      created_at: now,
      rotated_at: now
    };

    this.db.secrets.push(secret);
    this.saveDatabase();
    return secret;
  }

  /**
   * Haal secrets voor een specifiek project
   * @param projectId Project identifier
   * @returns Lijst van secrets
   */
  getSecretsByProject(projectId: string): Secret[] {
    return this.db.secrets.filter(s => s.project_id === projectId);
  }

  /**
   * Update een secret (voor rotatie)
   * @param secretId Secret identifier
   * @param encryptedValue Nieuwe geëncrypteerde waarde
   * @param iv Nieuwe initialisatie vector
   * @param authTag Nieuwe authenticatie tag
   * @returns Geüpdatete secret of undefined
   */
  updateSecret(
    secretId: string,
    encryptedValue: string,
    iv: string,
    authTag: string
  ): Secret | undefined {
    const secret = this.db.secrets.find(s => s.id === secretId);
    if (!secret) return undefined;

    secret.encrypted_value = encryptedValue;
    secret.iv = iv;
    secret.auth_tag = authTag;
    secret.rotated_at = new Date().toISOString();

    this.saveDatabase();
    return secret;
  }

  /**
   * Verwijder een secret
   * @param secretId Secret identifier
   * @returns True als verwijderd
   */
  deleteSecret(secretId: string): boolean {
    const index = this.db.secrets.findIndex(s => s.id === secretId);
    if (index === -1) return false;

    this.db.secrets.splice(index, 1);
    this.saveDatabase();
    return true;
  }

  /**
   * Verwijder een project en alle bijbehorende secrets
   * @param projectId Project identifier
   * @returns True als verwijderd
   */
  deleteProject(projectId: string): boolean {
    const projectIndex = this.db.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return false;

    // Verwijder project
    this.db.projects.splice(projectIndex, 1);
    
    // Verwijder alle gerelateerde secrets
    this.db.secrets = this.db.secrets.filter(s => s.project_id !== projectId);
    
    this.saveDatabase();
    return true;
  }
}
