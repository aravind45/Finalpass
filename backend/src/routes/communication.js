import { Router } from 'express';
import { CommunicationService } from '../services/communicationService.js';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
// GET /api/communication
router.get('/', async (req, res) => {
    try {
        const { estateId } = req.query;
        // Fix: Explicitly type the where clause for Prisma
        const whereClause = {};
        if (estateId) {
            whereClause.estateId = estateId;
        }
        // Let's return some mock data mixed with DB if available
        const communications = await prisma.communication.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        // If empty, return the mock data used in frontend initially for demo
        if (communications.length === 0) {
            return res.json([
                { id: '1', type: 'email', party: 'Fidelity', subject: 'Submission Received', date: '2 days ago', status: 'responded' },
                { id: '2', type: 'phone', party: 'Chase Bank', subject: 'Verification Call', date: '3 days ago', status: 'completed' },
                { id: '3', type: 'fax', party: 'IRS', subject: 'Form 56 (Fiduciary)', date: '5 days ago', status: 'pending' },
            ]);
        }
        // Map DB records to frontend format
        const mapped = communications.map(c => ({
            id: c.id,
            type: c.channel.toLowerCase(),
            party: 'Recipient', // You might want to store recipient name in metadata
            subject: 'Estate Communication',
            date: c.createdAt.toISOString().split('T')[0],
            status: c.status.toLowerCase()
        }));
        res.json(mapped);
    }
    catch (error) {
        console.error('Error fetching communications:', error);
        res.status(500).json({ error: 'Failed to fetch communications' });
    }
});
// POST /api/communication/fax
router.post('/fax', async (req, res) => {
    try {
        const { recipient, content, estateId, coverPage } = req.body;
        if (!recipient) {
            return res.status(400).json({ error: 'Recipient is required' });
        }
        // 1. Send via Service
        const faxId = await CommunicationService.sendFax({
            to: recipient,
            from: 'Estate Admin', // Configurable
            content: content || coverPage || 'Fax from Estate Settlement App',
            estateId: estateId || 'temp-estate-id'
        });
        // 2. Log to DB
        let targetEstateId = estateId;
        // Fix for 500 Error: Foreign Key Constraint
        // If no estateId is provided or it's a temp ID, find the first existing estate or create a demo one.
        if (!targetEstateId || targetEstateId === 'current-estate-id' || targetEstateId === 'temp-estate-id') {
            const firstEstate = await prisma.estate.findFirst();
            if (firstEstate) {
                targetEstateId = firstEstate.id;
            }
            else {
                // Create a demo estate if none exists (for fresh dev environments)
                const user = await prisma.user.findFirst();
                if (user) {
                    const newEstate = await prisma.estate.create({
                        data: {
                            name: 'Demo Estate',
                            userId: user.id,
                            deceasedInfo: '{}',
                            status: 'INITIATION'
                        }
                    });
                    targetEstateId = newEstate.id;
                }
                else {
                    console.warn('No user found for demo estate creation. Skipping DB log.');
                    targetEstateId = null;
                }
            }
        }
        if (targetEstateId) {
            await prisma.communication.create({
                data: {
                    estateId: targetEstateId,
                    channel: 'FAX',
                    status: 'PENDING',
                    content: content || 'Fax Document',
                    auditTrail: JSON.stringify({ faxId, recipient, timestamp: new Date() }),
                    metadata: JSON.stringify({ faxId, recipient })
                }
            });
        }
        res.json({ success: true, faxId, status: 'queued' });
    }
    catch (error) {
        console.error('Error sending fax:', error);
        res.status(500).json({ error: 'Failed to send fax' });
    }
});
export default router;
//# sourceMappingURL=communication.js.map