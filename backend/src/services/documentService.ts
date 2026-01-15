import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DocumentService {
    async createDocument(data: {
        estateId: string;
        type: string;
        fileName: string;
        filePath: string;
        fileSize: number;
        mimeType: string;
    }) {
        const document = await prisma.document.create({
            data: {
                ...data,
                status: 'VERIFIED',
                extractedData: JSON.stringify({ summary: "AI extraction simulation matched" })
            }
        });

        // AI SIMULATION: If uploading a WILL, automatically extract Beneficiaries
        if (data.type === 'WILL') {
            console.log("Simulating AI Extraction for Will...");
            await prisma.stakeholder.createMany({
                data: [
                    {
                        estateId: data.estateId,
                        type: 'BENEFICIARY',
                        info: JSON.stringify({ name: "Jane Doe", relation: "Spouse", email: "jane@example.com" }),
                        permissions: JSON.stringify({ role: "VIEWER" }),
                        active: true
                    },
                    {
                        estateId: data.estateId,
                        type: 'BENEFICIARY',
                        info: JSON.stringify({ name: "John Doe Jr", relation: "Son", email: "johnjr@example.com" }),
                        permissions: JSON.stringify({ role: "VIEWER" }),
                        active: true
                    }
                ]
            });
        }

        return document;
    }

    async getDocuments(estateId: string) {
        return prisma.document.findMany({
            where: { estateId },
            orderBy: { uploadedAt: 'desc' }
        });
    }
}

export const documentService = new DocumentService();
