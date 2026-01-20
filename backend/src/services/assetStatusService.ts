import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AssetStatusService {
    /**
     * Updates asset status based on fax status changes
     */
    async updateStatusFromFax(faxId: string, status: string) {
        const fax = await prisma.fax.findUnique({
            where: { id: faxId },
            select: { assetId: true }
        });

        if (!fax) return;

        let assetStatus = 'CONTACTED';
        if (status === 'delivered') {
            assetStatus = 'DOCUMENTS_SUBMITTED';
        } else if (status === 'failed') {
            assetStatus = 'CONTACTED'; // Or a new status like 'ACTION_REQUIRED'
        }

        await prisma.asset.update({
            where: { id: fax.assetId },
            data: {
                status: assetStatus,
                lastContactDate: new Date()
            }
        });

        console.log(`[AssetStatusService] Asset ${fax.assetId} status updated to ${assetStatus} due to fax ${status}`);
    }

    /**
     * Ensures an asset has the required checklist items for its institution
     */
    async ensureInstitutionChecklist(assetId: string) {
        const asset = await prisma.asset.findUnique({
            where: { id: assetId }
        });

        if (!asset) return;

        if (asset.institution.toLowerCase().includes('fidelity')) {
            await this.addFidelityChecklist(assetId);
        }
    }

    private async addFidelityChecklist(assetId: string) {
        const items = [
            { itemName: 'Letter of Instruction', itemType: 'form', required: true, sortOrder: 1 },
            { itemName: 'Certified Death Certificate', itemType: 'document', required: true, sortOrder: 2 },
            { itemName: 'Letters Testamentary', itemType: 'document', required: true, sortOrder: 3 },
            { itemName: 'Medallion Signature Guarantee', itemType: 'action', required: false, description: 'Required for transfers over $100k', sortOrder: 4 }
        ];

        for (const item of items) {
            // Check if already exists to avoid duplicates
            const exists = await prisma.assetChecklist.findFirst({
                where: { assetId, itemName: item.itemName }
            });

            if (!exists) {
                await prisma.assetChecklist.create({
                    data: {
                        assetId,
                        ...item
                    }
                });
            }
        }
        console.log(`[AssetStatusService] Fidelity checklist ensures for asset ${assetId}`);
    }
}

export const assetStatusService = new AssetStatusService();
