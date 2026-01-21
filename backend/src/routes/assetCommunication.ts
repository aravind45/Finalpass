import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { assetCommunicationService } from '../services/assetCommunicationService.js';
import { authService } from '../services/authService.js';

const prisma = new PrismaClient();

const router = Router();

// Middleware to extract user from token
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

// POST /api/assets/:assetId/communications
// Create a new communication record
router.post('/:assetId/communications', requireAuth, async (req: Request, res: Response) => {
    try {
        const { assetId } = req.params;
        const userId = (req as any).user.id;
        const {
            type,
            method,
            direction,
            subject,
            content,
            response,
            responseDate,
            nextActionDate,
            nextActionType
        } = req.body;

        // Validation
        if (!type || !method || !direction || !content) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: type, method, direction, content'
            });
        }

        const communication = await assetCommunicationService.createCommunication({
            assetId: assetId as string,
            type,
            method,
            direction,
            subject,
            content,
            response,
            responseDate: responseDate ? new Date(responseDate) : undefined,
            nextActionDate: nextActionDate ? new Date(nextActionDate) : undefined,
            nextActionType,
            createdById: userId
        });

        res.json({ success: true, communication });
    } catch (error: any) {
        console.error('Create communication error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/assets/:assetId/communications
// Get all communications for an asset
router.get('/:assetId/communications', requireAuth, async (req: Request, res: Response) => {
    try {
        const { assetId } = req.params;
        const communications = await assetCommunicationService.getCommunications(assetId as string);
        res.json({ success: true, communications });
    } catch (error: any) {
        console.error('Get communications error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/assets/:assetId/communications/timeline
// Get communication timeline (communications + escalations)
router.get('/:assetId/communications/timeline', requireAuth, async (req: Request, res: Response) => {
    try {
        const { assetId } = req.params;
        const timeline = await assetCommunicationService.getCommunicationTimeline(assetId as string);
        res.json({ success: true, timeline });
    } catch (error: any) {
        console.error('Get timeline error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/assets/:assetId/communications/stats
// Get communication statistics
router.get('/:assetId/communications/stats', requireAuth, async (req: Request, res: Response) => {
    try {
        const { assetId } = req.params;
        const stats = await assetCommunicationService.getCommunicationStats(assetId as string);
        res.json({ success: true, stats });
    } catch (error: any) {
        console.error('Get stats error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/assets/:assetId/next-actions
// Get next action recommendations
router.get('/:assetId/next-actions', requireAuth, async (req: Request, res: Response) => {
    try {
        const { assetId } = req.params;
        const recommendations = await assetCommunicationService.getNextActions(assetId as string);
        res.json({ success: true, recommendations });
    } catch (error: any) {
        console.error('Get next actions error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/communications/:communicationId
// Update a communication record
router.put('/communications/:communicationId', requireAuth, async (req: Request, res: Response) => {
    try {
        const { communicationId } = req.params;
        const { response, responseDate, nextActionDate, nextActionType } = req.body;

        const communication = await assetCommunicationService.updateCommunication(communicationId as string, {
            response,
            responseDate: responseDate ? new Date(responseDate) : undefined,
            nextActionDate: nextActionDate ? new Date(nextActionDate) : undefined,
            nextActionType
        });

        res.json({ success: true, communication });
    } catch (error: any) {
        console.error('Update communication error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/communications/:communicationId
// Delete a communication record
router.delete('/communications/:communicationId', requireAuth, async (req: Request, res: Response) => {
    try {
        const { communicationId } = req.params;
        await assetCommunicationService.deleteCommunication(communicationId as string);
        res.json({ success: true, message: 'Communication deleted' });
    } catch (error: any) {
        console.error('Delete communication error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/assets/:assetId/checklist
// Get checklist for an asset
router.get('/:assetId/checklist', requireAuth, async (req: Request, res: Response) => {
    try {
        const { assetId } = req.params;
        const checklist = await prisma.assetChecklist.findMany({
            where: { assetId: assetId as string },
            orderBy: { sortOrder: 'asc' }
        });
        res.json({ success: true, checklist });
    } catch (error: any) {
        console.error('Get checklist error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PATCH /api/assets/checklist/:itemId
// Update a checklist item
router.patch('/checklist/:itemId', requireAuth, async (req: Request, res: Response) => {
    try {
        const itemId = req.params.itemId as string;
        const { completed } = req.body;

        const item = await prisma.assetChecklist.update({
            where: { id: itemId },
            data: {
                completed,
                completedDate: completed ? new Date() : null
            }
        });

        res.json({ success: true, item });
    } catch (error: any) {
        console.error('Update checklist item error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
