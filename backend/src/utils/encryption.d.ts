/**
 * Encrypt sensitive data using AES-256-GCM
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encrypted
 */
export declare function encrypt(text: string): string;
/**
 * Decrypt data encrypted with encrypt()
 * @param encryptedData - Encrypted string in format: iv:authTag:encrypted
 * @returns Decrypted plain text
 */
export declare function decrypt(encryptedData: string): string;
/**
 * Hash a token for storage (one-way hash)
 * Used for session token storage
 */
export declare function hashToken(token: string): string;
/**
 * Generate a cryptographically secure random token
 */
export declare function generateSecureToken(length?: number): string;
/**
 * Mask sensitive data for display (e.g., SSN)
 * Shows only last 4 characters
 */
export declare function maskSensitiveData(data: string, visibleChars?: number): string;
//# sourceMappingURL=encryption.d.ts.map