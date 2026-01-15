
import { PrismaClient } from '@prisma/client';
import { aiService } from './aiService.js';

const prisma = new PrismaClient();

export class FamilyService {
    /**
     * Generates a conversational weekly update for family members/beneficiaries.
     */
    static async generateWeeklyUpdate(estateId: string, executorName: string): Promise<string> {
        // 1. Fetch Estate Data
        const estate = await prisma.estate.findUnique({
            where: { id: estateId },
            include: {
                assets: true,
                documents: true,
                communications: {
                    where: { status: { not: 'COMPLETED' } }, // Only pending/failed comms might be relevant "waiting on" items
                    take: 5
                }
            }
        });

        if (!estate) throw new Error('Estate not found');

        const deceasedInfo = JSON.parse(estate.deceasedInfo || '{}');
        const deceasedName = deceasedInfo.name || 'The Deceased';

        // 2. Synthesize Progress
        const assetsFound = estate.assets.length;
        const assetsValue = estate.assets.reduce((sum, a) => sum + Number(a.value || 0), 0);
        const docsUploaded = estate.documents.length;

        // Categorize Assets
        const completedAssets = estate.assets.filter(a => a.status === 'DISTRIBUTED' || a.status === 'CLOSED');
        const inProgressAssets = estate.assets.filter(a => a.status !== 'DISTRIBUTED' && a.status !== 'CLOSED');

        // Categorize Documents
        const completedDocs = estate.documents.filter(d => d.status === 'VERIFIED');
        const pendingDocs = estate.documents.filter(d => d.status !== 'VERIFIED');

        // Recent Activity (naive implementation: just list what we have)
        const recentActivity = `
            - identified ${assetsFound} total assets to date (approx value $${assetsValue}).
            - ${completedAssets.length} assets have been successfully closed/transferred.
            - ${inProgressAssets.length} assets are currently being processed with institutions.
            - ${docsUploaded} documents have been uploaded to the system.
        `;

        // 3. Build Prompt
        const keyDetails = `
            Deceased: ${deceasedName}
            Executor: ${executorName}
            
            Current Status:
            ${recentActivity}
            
            Completed Items:
            ${completedAssets.map(a => `- Settled: ${a.institution} (${a.type})`).join('\n')}
            ${completedDocs.map(d => `- Analyzed: ${d.type}`).join('\n')}

            In Progress / Waiting On:
            ${inProgressAssets.map(a => `- Processing: ${a.institution}`).join('\n')}
            ${pendingDocs.map(d => `- Reviewing: ${d.type}`).join('\n')}
            
            Goal: Write a reassuring, transparent weekly email update to the beneficiaries. 
            Tone: Professional but empathetic. 
            Structure: 
            1. Brief greeting.
            2. "What's Done" section.
            3. "What's Next" section.
            4. Closing (no action required).
        `.trim();

        // 4. Generate with AI
        return await aiService.generateDraft({
            type: 'email',
            recipient: 'Beneficiaries',
            purpose: 'Weekly Estate Settlement Progress Update',
            tone: 'sympathetic',
            keyDetails: keyDetails
        });
    }
}
