import express from 'express';
import { PrismaClient } from '@prisma/client';
import { assetStatusService } from '../services/assetStatusService.js';
import { assetCommunicationService } from '../services/assetCommunicationService.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/test/simulate-fax-status
 * Manually trigger a status update for a fax
 */
router.post('/simulate-fax-status', async (req, res) => {
    try {
        const { faxId, status } = req.body;

        if (!faxId || !status) {
            return res.status(400).json({ error: 'Missing faxId or status' });
        }

        // 1. Update Fax Record
        const fax = await prisma.fax.update({
            where: { id: faxId },
            data: {
                status,
                deliveredAt: status === 'delivered' ? new Date() : undefined,
                failedAt: status === 'failed' ? new Date() : undefined
            }
        });

        // 2. Trigger Asset Update (same as FaxService would do)
        await assetStatusService.updateStatusFromFax(faxId, status);

        res.json({ success: true, message: `Fax ${faxId} status updated to ${status}` });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/test/simulate-fidelity-message
 * Simulates an inbound message from Fidelity
 */
router.post('/simulate-fidelity-message', async (req, res) => {
    try {
        const { assetId, content, subject } = req.body;

        if (!assetId || !content) {
            return res.status(400).json({ error: 'Missing assetId or content' });
        }

        const comm = await assetCommunicationService.createCommunication({
            assetId,
            type: 'response',
            method: 'fax',
            direction: 'inbound',
            subject: subject || 'Response from Fidelity Estate Services',
            content,
            createdById: 'system' // Mock as system
        });

        res.json({ success: true, communication: comm });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
