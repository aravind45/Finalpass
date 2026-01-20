import { Router } from 'express';
import { assetCommunicationService } from '../services/assetCommunicationService.js';
import { authService } from '../services/authService.js';
const router = Router();
// Middleware to extract user from token
const requireAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'No token provided' });
    try {
        const user = await authService.verifyToken(token);
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
// POST /api/assets/:assetId/communications
// Create a new communication record
router.post('/:assetId/communications', requireAuth, async (req, res) => {
    try {
        const { assetId } = req.params;
        const userId = req.user.id;
        const { type, method, direction, subject, content, response, responseDate, nextActionDate, nextActionType } = req.body;
        // Validation
        if (!type || !method || !direction || !content) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: type, method, direction, content'
            });
        }
        const communication = await assetCommunicationService.createCommunication({
            assetId,
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
    }
    catch (error) {
        console.error('Create communication error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/assets/:assetId/communications
// Get all communications for an asset
router.get('/:assetId/communications', requireAuth, async (req, res) => {
    try {
        const { assetId } = req.params;
        const communications = await assetCommunicationService.getCommunications(assetId);
        res.json({ success: true, communications });
    }
    catch (error) {
        console.error('Get communications error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/assets/:assetId/communications/timeline
// Get communication timeline (communications + escalations)
router.get('/:assetId/communications/timeline', requireAuth, async (req, res) => {
    try {
        const { assetId } = req.params;
        const timeline = await assetCommunicationService.getCommunicationTimeline(assetId);
        res.json({ success: true, timeline });
    }
    catch (error) {
        console.error('Get timeline error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/assets/:assetId/communications/stats
// Get communication statistics
router.get('/:assetId/communications/stats', requireAuth, async (req, res) => {
    try {
        const { assetId } = req.params;
        const stats = await assetCommunicationService.getCommunicationStats(assetId);
        res.json({ success: true, stats });
    }
    catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/assets/:assetId/next-actions
// Get next action recommendations
router.get('/:assetId/next-actions', requireAuth, async (req, res) => {
    try {
        const { assetId } = req.params;
        const recommendations = await assetCommunicationService.getNextActions(assetId);
        res.json({ success: true, recommendations });
    }
    catch (error) {
        console.error('Get next actions error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// PUT /api/communications/:communicationId
// Update a communication record
router.put('/communications/:communicationId', requireAuth, async (req, res) => {
    try {
        const { communicationId } = req.params;
        const { response, responseDate, nextActionDate, nextActionType } = req.body;
        const communication = await assetCommunicationService.updateCommunication(communicationId, {
            response,
            responseDate: responseDate ? new Date(responseDate) : undefined,
            nextActionDate: nextActionDate ? new Date(nextActionDate) : undefined,
            nextActionType
        });
        res.json({ success: true, communication });
    }
    catch (error) {
        console.error('Update communication error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// DELETE /api/communications/:communicationId
// Delete a communication record
router.delete('/communications/:communicationId', requireAuth, async (req, res) => {
    try {
        const { communicationId } = req.params;
        await assetCommunicationService.deleteCommunication(communicationId);
        res.json({ success: true, message: 'Communication deleted' });
    }
    catch (error) {
        console.error('Delete communication error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
export default router;
//# sourceMappingURL=assetCommunication.js.map