import type { Request } from 'express';
interface AuditLogData {
    userId?: string | undefined;
    action: string;
    resource: string;
    result: 'SUCCESS' | 'FAILURE' | 'DENIED';
    ipAddress: string;
    userAgent: string;
    sessionId?: string | undefined;
    metadata?: Record<string, any>;
}
/**
 * Extract client IP address from request
 */
export declare function getClientIp(req: Request): string;
/**
 * Log an audit event
 */
export declare function logAudit(data: AuditLogData): Promise<void>;
/**
 * Log a login attempt
 */
export declare function logLogin(email: string, success: boolean, req: Request, userId?: string): Promise<void>;
/**
 * Log access to sensitive data
 */
export declare function logSensitiveAccess(userId: string, action: string, resource: string, req: Request, sessionId?: string): Promise<void>;
/**
 * Log unauthorized access attempt
 */
export declare function logUnauthorizedAccess(userId: string | undefined, resource: string, req: Request): Promise<void>;
/**
 * Get recent failed login attempts for an IP address
 */
export declare function getFailedLoginAttempts(ipAddress: string, timeWindowMinutes?: number): Promise<number>;
/**
 * Check if IP is suspicious (too many failed attempts)
 */
export declare function isSuspiciousIp(ipAddress: string): Promise<boolean>;
export {};
//# sourceMappingURL=auditService.d.ts.map