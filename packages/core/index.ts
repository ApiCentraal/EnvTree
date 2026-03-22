import { encrypt, decrypt, deriveKey, generateSalt, generateMasterKey } from "@envtree/crypto";
import { Storage, Project, Secret } from "@envtree/storage";

/**
 * Interface voor een secret met gedecrypteerde waarde
 */
export interface SecretWithDecryptedValue extends Secret {
  /** Gedecrypteerde waarde (alleen in memory) */
  value: string;
}

/**
 * Interface voor vault service configuratie
 */
export interface VaultConfig {
  /** Master key voor encryptie */
  masterKey: string;
  /** Database pad (optioneel) */
  dbPath?: string;
}

/**
 * Core vault service voor secret management
 * Beheert encryptie, opslag en business logic
 */
export class VaultService {
  private storage: Storage;
  private masterKey: Buffer;

  constructor(config: VaultConfig) {
    this.storage = new Storage(config.dbPath);
    
    // Converteer hex master key naar Buffer
    this.masterKey = Buffer.from(config.masterKey, "hex");
  }

  /**
   * Initialiseer een nieuw project
   * @param name Project naam
   * @param projectPath Project pad
   * @returns Aangemaakt project
   */
  initProject(name: string, projectPath: string): Project {
    // Check of project al bestaat
    const existing = this.storage.getProjectByPath(projectPath);
    if (existing) {
      throw new Error(`Project bestaat al: ${existing.name}`);
    }

    return this.storage.addProject(name, projectPath);
  }

  /**
   * Haal project op basis van pad
   * @param projectPath Project pad
   * @returns Project of undefined
   */
  getProject(projectPath: string): Project | undefined {
    return this.storage.getProjectByPath(projectPath);
  }

  /**
   * Haal alle projecten op
   * @returns Lijst van projecten
   */
  getProjects(): Project[] {
    return this.storage.getProjects();
  }

  /**
   * Voeg een nieuwe secret toe aan een project
   * @param projectPath Project pad
   * @param key Secret key naam
   * @param value Secret waarde
   * @returns Aangemaakte secret
   */
  addSecret(projectPath: string, key: string, value: string): Secret {
    const project = this.getProject(projectPath);
    if (!project) {
      throw new Error(`Project niet gevonden: ${projectPath}`);
    }

    // Encrypt de waarde
    const encrypted = encrypt(value, this.masterKey);

    return this.storage.addSecret(
      project.id,
      key,
      encrypted.encrypted,
      encrypted.iv,
      encrypted.tag
    );
  }

  /**
   * Haal alle secrets voor een project (met gedecrypteerde waarden)
   * @param projectPath Project pad
   * @returns Lijst van secrets met gedecrypteerde waarden
   */
  getSecrets(projectPath: string): SecretWithDecryptedValue[] {
    const project = this.getProject(projectPath);
    if (!project) {
      throw new Error(`Project niet gevonden: ${projectPath}`);
    }

    const secrets = this.storage.getSecretsByProject(project.id);
    
    return secrets.map(secret => ({
      ...secret,
      value: decrypt(
        {
          encrypted: secret.encrypted_value,
          iv: secret.iv,
          tag: secret.auth_tag
        },
        this.masterKey
      )
    }));
  }

  /**
   * Haal een specifieke secret op
   * @param projectPath Project pad
   * @param key Secret key naam
   * @returns Secret met gedecrypteerde waarde of undefined
   */
  getSecret(projectPath: string, key: string): SecretWithDecryptedValue | undefined {
    const secrets = this.getSecrets(projectPath);
    return secrets.find(s => s.key === key);
  }

  /**
   * Roteer een secret (genereer nieuwe waarde)
   * @param projectPath Project pad
   * @param key Secret key naam
   * @param newValue Nieuwe waarde (optioneel, wordt anders gegenereerd)
   * @returns Geüpdatete secret
   */
  rotateSecret(projectPath: string, key: string, newValue?: string): SecretWithDecryptedValue {
    const project = this.getProject(projectPath);
    if (!project) {
      throw new Error(`Project niet gevonden: ${projectPath}`);
    }

    const secrets = this.storage.getSecretsByProject(project.id);
    const secret = secrets.find(s => s.key === key);
    if (!secret) {
      throw new Error(`Secret niet gevonden: ${key}`);
    }

    // Genereer nieuwe waarde als niet meegegeven
    const value = newValue || this.generateSecureValue();
    
    // Encrypt nieuwe waarde
    const encrypted = encrypt(value, this.masterKey);

    const updated = this.storage.updateSecret(
      secret.id,
      encrypted.encrypted,
      encrypted.iv,
      encrypted.tag
    );

    if (!updated) {
      throw new Error("Rotatie mislukt");
    }

    return {
      ...updated,
      value
    };
  }

  /**
   * Verwijder een secret
   * @param projectPath Project pad
   * @param key Secret key naam
   * @returns True als verwijderd
   */
  deleteSecret(projectPath: string, key: string): boolean {
    const project = this.getProject(projectPath);
    if (!project) {
      throw new Error(`Project niet gevonden: ${projectPath}`);
    }

    const secrets = this.storage.getSecretsByProject(project.id);
    const secret = secrets.find(s => s.key === key);
    if (!secret) {
      return false;
    }

    return this.storage.deleteSecret(secret.id);
  }

  /**
   * Genereer een veilige willekeurige waarde
   * @param length Lengte van de waarde (default 32 karakters)
   * @returns Willekeurige hex string
   */
  private generateSecureValue(length: number = 32): string {
    const crypto = require("crypto");
    return crypto.randomBytes(length).toString("hex");
  }

  /**
   * Exporteer secrets voor .env injectie
   * @param projectPath Project pad
   * @returns Environment variables string
   */
  exportForEnv(projectPath: string): string {
    const secrets = this.getSecrets(projectPath);
    
    return secrets
      .map(secret => `${secret.key}=${secret.value}`)
      .join("\n");
  }

  /**
   * Valideer master key
   * @returns True als key geldig is
   */
  validateMasterKey(): boolean {
    try {
      // Probeer een test encryptie/decryptie
      const test = "test";
      const encrypted = encrypt(test, this.masterKey);
      const decrypted = decrypt(encrypted, this.masterKey);
      return decrypted === test;
    } catch {
      return false;
    }
  }
}

/**
 * Factory functie voor vault service met nieuwe master key
 * @param dbPath Optioneel database pad
 * @returns Vault service en master key
 */
export function createVaultWithNewKey(dbPath?: string): { service: VaultService; masterKey: string } {
  const masterKey = generateMasterKey();
  const service = new VaultService({ masterKey, dbPath });
  
  return { service, masterKey };
}
