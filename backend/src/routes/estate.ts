import { Router } from 'express';
import type { Request, Response } from 'express';
import { estateService } from '../services/estateService.js';
import { authService } from '../services/authService.js';

const router = Router();

// Middleware to extract user from token (simplified for MVP speed)
const requireAuth = async (req: Request, res: Response, next: Function) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const user = await authService.verifyToken(token);
        (req as any).user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// GET /api/estates/dashboard
// Returns the home estate + assets for the dashboard
router.get('/dashboard', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const estate = await estateService.getORCreateHomeEstate(userId);
        res.json({ success: true, estate });
    } catch (error: any) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
