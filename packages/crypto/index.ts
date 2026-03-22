import crypto from "crypto";

/**
 * Encryptie algoritme configuratie
 * Gebruikt AES-256-GCM voor authenticated encryption
 */
const ALGO = "aes-256-gcm";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits
const SALT_LENGTH = 32; // 256 bits

/**
 * Interface voor geëncrypteerde data
 */
export interface EncryptedData {
  /** Geëncrypteerde waarde in hex formaat */
  encrypted: string;
  /** Initialisatie vector in hex formaat */
  iv: string;
  /** Authenticatie tag in hex formaat */
  tag: string;
}

/**
 * Derive een sleutel van een wachtwoord met PBKDF2
 * @param password Het gebruikerswachtwoord
 * @param salt De salt voor key derivation
 * @returns Gederiveerde sleutel als Buffer
 */
export function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, "sha256");
}

/**
 * Genereer een willekeurige salt
 * @returns Salt als Buffer
 */
export function generateSalt(): Buffer {
  return crypto.randomBytes(SALT_LENGTH);
}

/**
 * Encrypt een tekst met AES-256-GCM
 * @param text De te encrypteren tekst
 * @param key De encryptiesleutel (32 bytes)
 * @returns Geëncrypteerde data met IV en tag
 */
export function encrypt(text: string, key: Buffer): EncryptedData {
  // Genereer willekeurige IV voor elke encryptie
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Maak cipher met AES-256-GCM
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  
  // Encrypt de tekst
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  // Haal de authenticatie tag op voor integriteitscontrole
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex")
  };
}

/**
 * Decrypt een tekst met AES-256-GCM
 * @param data De geëncrypteerde data
 * @param key De decryptiesleutel (32 bytes)
 * @returns Gedecrypteerde tekst
 * @throws Error als decryptie mislukt (verkeerde sleutel of corrupte data)
 */
export function decrypt(data: EncryptedData, key: Buffer): string {
  try {
    // Maak decipher met dezelfde parameters
    const decipher = crypto.createDecipheriv(
      ALGO,
      key,
      Buffer.from(data.iv, "hex")
    );
    
    // Stel de authenticatie tag in voor verificatie
    decipher.setAuthTag(Buffer.from(data.tag, "hex"));
    
    // Decrypt de data
    let decrypted = decipher.update(data.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    throw new Error("Decryptie mislukt: ongeldige sleutel of corrupte data");
  }
}

/**
 * Genereer een willekeurige master key
 * @returns Willekeurige 32-byte key in hex formaat
 */
export function generateMasterKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString("hex");
}

/**
 * Valideer of een key de juiste lengte heeft
 * @param key De te valideren key
 * @returns True als de key 32 bytes is
 */
export function isValidKey(key: Buffer): boolean {
  return key.length === KEY_LENGTH;
}
