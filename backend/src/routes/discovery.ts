
import express from 'express';
import { DiscoveryService } from '../services/discoveryService.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/discovery/analyze
 * Body: { text: string, fileName: string }
 * (For MVP, we act as if the text was already extracted by OCR on the frontend or we simulate it)
 */
router.post('/analyze', requireAuth, async (req, res) => {
    try {
        const { text, fileName } = req.body;

        // If no text provided, we simulate it based on filename for demo purposes
        const contentToAnalyze = text || DiscoveryService.simulateOcr(fileName || 'unknown.txt');

        const assets = await DiscoveryService.scanDocument(contentToAnalyze, fileName || 'Upload');

        res.json({ success: true, assets });
    } catch (error) {
        console.error('Discovery Error:', error);
        res.status(500).json({ success: false, error: 'Failed to analyze document' });
    }
});

export default router;
