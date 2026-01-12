import express, { type Request, type Response } from 'express';
import { authService } from '../services/authService.js';
import { requireAuth, type AuthRequest } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user with email/password
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, name, role, state } = req.body;

        // Validation
        if (!email || !password || !name || !role || !state) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: email, password, name, role, state'
            });
        }

        if (!['EXECUTOR', 'BENEFICIARY'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Role must be either EXECUTOR or BENEFICIARY'
            });
        }

        const result = await authService.register({
            email,
            password,
            name,
            role,
            state
        });

        res.json({
            success: true,
            ...result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message || 'Registration failed'
        });
    }
});

/**
 * POST /api/auth/login
 * Login with email/password
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await authService.login({
            email,
            password,
            req // Pass request for IP tracking
        });

        res.json({
            success: true,
            ...result
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            error: error.message || 'Login failed'
        });
    }
});

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
    res.json({
        success: true,
        data: {
            user: req.user
        }
    });
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal, server just confirms)
 */
router.post('/logout', requireAuth, async (req: AuthRequest, res: Response) => {
    // In a JWT-based system, logout is primarily client-side (remove token)
    // Server can optionally maintain a blacklist of revoked tokens
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

export default router;
