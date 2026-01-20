import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
/**
 * Extract client IP address from request
 */
export function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded;
        return (ip || '').split(',')[0]?.trim() || 'unknown';
    }
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
        const ip = Array.isArray(realIp) ? realIp[0] : realIp;
        return ip || 'unknown';
    }
    return req.socket.remoteAddress || 'unknown';
}
/**
 * Log an audit event
 */
export async function logAudit(data) {
    try {
        await prisma.auditLog.create({
            data: {
                userId: data.userId || null,
                action: data.action,
                resource: data.resource,
                result: data.result,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                sessionId: data.sessionId || null,
                metadata: JSON.stringify(data.metadata || {}),
                timestamp: new Date()
            }
        });
    }
    catch (error) {
        // Log to console if audit logging fails (don't throw - audit failure shouldn't break app)
        console.error('Audit logging failed:', error);
    }
}
/**
 * Log a login attempt
 */
export async function logLogin(email, success, req, userId) {
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
export async function logSensitiveAccess(userId, action, resource, req, sessionId) {
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
export async function logUnauthorizedAccess(userId, resource, req) {
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
export async function getFailedLoginAttempts(ipAddress, timeWindowMinutes = 15) {
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
export async function isSuspiciousIp(ipAddress) {
    const failedAttempts = await getFailedLoginAttempts(ipAddress, 15);
    return failedAttempts >= 5;
}
//# sourceMappingURL=auditService.js.map