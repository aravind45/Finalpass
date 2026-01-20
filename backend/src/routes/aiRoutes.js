import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { FamilyService } from '../services/familyService.js';
import { AdvocacyService } from '../services/advocacyService.js';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
// POST /api/ai/family/update
router.post('/family/update', requireAuth, async (req, res) => {
    try {
        const { estateId } = req.body;
        const user = req.user;
        if (!estateId) {
            return res.status(400).json({ success: false, error: 'estateId is required' });
        }
        const draft = await FamilyService.generateWeeklyUpdate(estateId, user.name);
        res.json({ success: true, draft });
    }
    catch (error) {
        console.error('Family Update Error:', error);
        res.status(500).json({ success: false, error: 'Failed to generate update' });
    }
});
// POST /api/ai/advocacy/escalate
router.post('/advocacy/escalate', requireAuth, async (req, res) => {
    try {
        const { assetId, institution, accountType, daysSilent } = req.body;
        const user = req.user;
        let ctx = {
            institution: institution || 'Unknown Institution',
            accountType: accountType || 'Account',
            daysSilent: daysSilent || 14,
            executorName: user.name
        };
        if (assetId) {
            const asset = await prisma.asset.findUnique({ where: { id: assetId } });
            if (asset) {
                ctx.institution = asset.institution;
                ctx.accountType = asset.type;
            }
        }
        const letter = await AdvocacyService.generateEscalationLetter(ctx);
        res.json({ success: true, letter });
    }
    catch (error) {
        console.error('Escalation Letter Error:', error);
        res.status(500).json({ success: false, error: 'Failed to generate letter' });
    }
});
export default router;
//# sourceMappingURL=aiRoutes.js.map