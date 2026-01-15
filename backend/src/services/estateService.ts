import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EstateService {
    /**
     * Get the primary estate for a user, or create the "Demo" estate if none exists.
     * This ensures the user sees the "John Doe" example from the requirements immediately.
     */
    async getORCreateHomeEstate(userId: string) {
        // 1. Try to find existing estate
        const existingEstate = await prisma.estate.findFirst({
            where: { userId },
            include: {
                assets: true
            }
        });

        if (existingEstate) {
            return existingEstate;
        }

        // 2. If none, create the "Spec Compliant" Demo Estate
        return this.createDemoEstate(userId);
    }

    /**
     * Create the "John Doe" estate exactly as specified in estate-lifecycle-mvp-spec.md
     */
    private async createDemoEstate(userId: string) {
        // Create Estate
        const estate = await prisma.estate.create({
            data: {
                userId,
                name: "John Doe Estate",
                deceasedInfo: JSON.stringify({
                    name: "John Doe",
                    dateOfDeath: "2024-01-01",
                    residence: "San Francisco, CA"
                }),
                status: "ADVOCACY", // Asset Discovery Phase
                complexityScore: 5,
                deceasedState: "CA",
                assets: {
                    create: [
                        {
                            institution: "Fidelity",
                            type: "401k",
                            value: 150000,
                            status: "CONTACTED", // In Review
                            requirements: JSON.stringify({
                                urgentAction: "Supervisor Escalation due Feb 3"
                            }),
                            metadata: JSON.stringify({
                                lastContact: "2024-01-27",
                                lastResponse: "Processing, no timeline",
                                urgency: "high"
                            })
                        },
                        {
                            institution: "Chase",
                            type: "Checking",
                            value: 25000,
                            status: "CONTACTED", // Docs Submitted
                            requirements: JSON.stringify({
                                nextAction: "Follow-up call due Feb 1"
                            }),
                            metadata: JSON.stringify({
                                lastContact: "2024-01-25",
                                lastResponse: "Received documents",
                                urgency: "medium"
                            })
                        },
                        {
                            institution: "Invesco",
                            type: "IRA",
                            value: 75000,
                            status: "DISTRIBUTED", // Completed
                            requirements: JSON.stringify({}),
                            metadata: JSON.stringify({
                                completedDate: "2024-01-30",
                                urgency: "low"
                            })
                        }
                    ]
                }
            },
            include: {
                assets: true
            }
        });

        return estate;
    }

    /**
     * Retrieve a single estate by its ID, including related assets.
     */
    async getEstateById(estateId: string) {
        return await prisma.estate.findUnique({
            where: { id: estateId },
            include: { assets: true },
        });
    }
}
export const estateService = new EstateService();
