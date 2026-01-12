import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        state: string;
    };
}

/**
 * Middleware to require authentication
 */
export const requireAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No authentication token provided'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const user = await authService.verifyToken(token);

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};

/**
 * Middleware to require specific role
 */
export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
        }

        next();
    };
};
