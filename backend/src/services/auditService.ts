import { PrismaClient } from '@prisma/client';
import type { Request } from 'express';

const prisma = new PrismaClient();

interface AuditLogData {
    userId?: string;
    action: string;
    resource: string;
    result: 'SUCCESS' | 'FAILURE' | 'DENIED';
    ipAddress: string;
    userAgent: string;
    sessionId?: string;
    metadata?: Record<string, any>;
}

/**
 * Extract client IP address from request
 */
export function getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.toString().split(',')[0].trim();
    }

    const realIp = req.headers['x-real-ip'];
    if (realIp) {
        return realIp.toString();
    }

    return req.socket.remoteAddress || 'unknown';
}

/**
 * Log an audit event
 */
export async function logAudit(data: AuditLogData): Promise<void> {
    try {
        await prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                resource: data.resource,
                result: data.result,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                sessionId: data.sessionId,
                metadata: data.metadata || {},
                timestamp: new Date()
            }
        });
    } catch (error) {
        // Log to console if audit logging fails (don't throw - audit failure shouldn't break app)
        console.error('Audit logging failed:', error);
    }
}

/**
 * Log a login attempt
 */
export async function logLogin(
    email: string,
    success: boolean,
    req: Request,
    userId?: string
): Promise<void> {
    await logAudit({
        userId,
        action: 'LOGIN',
        resource: `User:${email}`,
        result: success ? 'SUCCESS' : 'FAILURE',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: { email }
    });
}

/**
 * Log access to sensitive data
 */
export async function logSensitiveAccess(
    userId: string,
    action: string,
    resource: string,
    req: Request,
    sessionId?: string
): Promise<void> {
    await logAudit({
        userId,
        action,
        resource,
        result: 'SUCCESS',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] || 'unknown',
        sessionId,
        metadata: { timestamp: new Date().toISOString() }
    });
}

/**
 * Log unauthorized access attempt
 */
export async function logUnauthorizedAccess(
    userId: string | undefined,
    resource: string,
    req: Request
): Promise<void> {
    await logAudit({
        userId,
        action: 'ACCESS_DENIED',
        resource,
        result: 'DENIED',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
            attemptedAt: new Date().toISOString()
        }
    });
}

/**
 * Get recent failed login attempts for an IP address
 */
export async function getFailedLoginAttempts(
    ipAddress: string,
    timeWindowMinutes: number = 15
): Promise<number> {
    const since = new Date(Date.now() - timeWindowMinutes * 60 * 1000);

    const count = await prisma.auditLog.count({
        where: {
            action: 'LOGIN',
            result: 'FAILURE',
            ipAddress,
            timestamp: { gte: since }
        }
    });

    return count;
}

/**
 * Check if IP is suspicious (too many failed attempts)
 */
export async function isSuspiciousIp(ipAddress: string): Promise<boolean> {
    const failedAttempts = await getFailedLoginAttempts(ipAddress, 15);
    return failedAttempts >= 5;
}
