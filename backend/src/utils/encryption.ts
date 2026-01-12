import crypto from 'crypto';

// Load encryption key from environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    console.warn('WARNING: ENCRYPTION_KEY should be a 64-character hex string (32 bytes). Using fallback for development.');
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encrypted
 */
export function encrypt(text: string): string {
    if (!text) return '';

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        ALGORITHM,
        Buffer.from(ENCRYPTION_KEY, 'hex'),
        iv
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Return: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt data encrypted with encrypt()
 * @param encryptedData - Encrypted string in format: iv:authTag:encrypted
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
    if (!encryptedData) return '';

    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
    }

    const [ivHex, authTagHex, encrypted] = parts;

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(ENCRYPTION_KEY, 'hex'),
        Buffer.from(ivHex, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Hash a token for storage (one-way hash)
 * Used for session token storage
 */
export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Mask sensitive data for display (e.g., SSN)
 * Shows only last 4 characters
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (!data || data.length <= visibleChars) return data;
    return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
}
