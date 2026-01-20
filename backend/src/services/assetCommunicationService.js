import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class AssetCommunicationService {
    /**
     * Create a new communication record for an asset
     */
    async createCommunication(input) {
        const communication = await prisma.assetCommunication.create({
            data: {
                assetId: input.assetId,
                type: input.type,
                method: input.method,
                direction: input.direction,
                subject: input.subject,
                content: input.content,
                response: input.response,
                responseDate: input.responseDate,
                nextActionDate: input.nextActionDate,
                nextActionType: input.nextActionType,
                createdById: input.createdById
            },
            include: {
                asset: {
                    include: {
                        estate: true
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        // Update asset metadata with last contact date
        await this.updateAssetLastContact(input.assetId);
        // Check if escalation is needed
        await this.checkEscalationNeeded(input.assetId);
        return communication;
    }
    /**
     * Get all communications for an asset
     */
    async getCommunications(assetId) {
        return await prisma.assetCommunication.findMany({
            where: { assetId },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
    }
    /**
     * Update a communication record (e.g., add response)
     */
    async updateCommunication(communicationId, input) {
        const communication = await prisma.assetCommunication.update({
            where: { id: communicationId },
            data: input,
            include: {
                asset: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        // Update asset metadata
        await this.updateAssetLastContact(communication.assetId);
        return communication;
    }
    /**
     * Delete a communication record
     */
    async deleteCommunication(communicationId) {
        return await prisma.assetCommunication.delete({
            where: { id: communicationId }
        });
    }
    /**
     * Get communication timeline for an asset
     */
    async getCommunicationTimeline(assetId) {
        const communications = await this.getCommunications(assetId);
        const escalations = await prisma.escalation.findMany({
            where: { assetId },
            orderBy: { triggeredDate: 'desc' }
        });
        // Merge and sort by date
        const timeline = [
            ...communications.map(c => ({
                type: 'communication',
                date: c.date,
                data: c
            })),
            ...escalations.map(e => ({
                type: 'escalation',
                date: e.triggeredDate,
                data: e
            }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime());
        return timeline;
    }
    /**
     * Get next action recommendations for an asset
     */
    async getNextActions(assetId) {
        const asset = await prisma.asset.findUnique({
            where: { id: assetId },
            include: {
                assetCommunications: {
                    orderBy: { date: 'desc' },
                    take: 1
                },
                escalations: {
                    where: { status: 'pending' },
                    orderBy: { triggeredDate: 'desc' }
                }
            }
        });
        if (!asset) {
            throw new Error('Asset not found');
        }
        const lastCommunication = asset.assetCommunications[0];
        const pendingEscalation = asset.escalations[0];
        const recommendations = [];
        // Check if follow-up is needed
        if (lastCommunication) {
            const daysSinceLastContact = Math.floor((Date.now() - lastCommunication.date.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceLastContact >= 7 && !lastCommunication.response) {
                recommendations.push({
                    type: 'follow_up',
                    priority: daysSinceLastContact >= 14 ? 'high' : 'medium',
                    message: `${daysSinceLastContact} days since last contact with no response`,
                    suggestedAction: daysSinceLastContact >= 14 ? 'Escalate to supervisor' : 'Send follow-up inquiry',
                    dueDate: new Date()
                });
            }
            if (lastCommunication.nextActionDate && lastCommunication.nextActionDate <= new Date()) {
                recommendations.push({
                    type: 'scheduled_action',
                    priority: 'high',
                    message: `Scheduled action: ${lastCommunication.nextActionType || 'Follow up'}`,
                    suggestedAction: lastCommunication.nextActionType || 'Follow up',
                    dueDate: lastCommunication.nextActionDate
                });
            }
        }
        // Check pending escalations
        if (pendingEscalation) {
            recommendations.push({
                type: 'escalation',
                priority: 'high',
                message: `Level ${pendingEscalation.level} escalation pending`,
                suggestedAction: 'Review and send escalation',
                dueDate: pendingEscalation.triggeredDate
            });
        }
        return recommendations;
    }
    /**
     * Update asset metadata with last contact date
     */
    async updateAssetLastContact(assetId) {
        const lastCommunication = await prisma.assetCommunication.findFirst({
            where: { assetId },
            orderBy: { date: 'desc' }
        });
        if (lastCommunication) {
            const asset = await prisma.asset.findUnique({
                where: { id: assetId }
            });
            if (asset) {
                const metadata = asset.metadata ? JSON.parse(asset.metadata) : {};
                metadata.lastContact = lastCommunication.date.toISOString();
                metadata.lastContactType = lastCommunication.type;
                metadata.lastContactMethod = lastCommunication.method;
                await prisma.asset.update({
                    where: { id: assetId },
                    data: {
                        metadata: JSON.stringify(metadata)
                    }
                });
            }
        }
    }
    /**
     * Check if escalation is needed based on communication history
     */
    async checkEscalationNeeded(assetId) {
        const communications = await prisma.assetCommunication.findMany({
            where: { assetId },
            orderBy: { date: 'desc' }
        });
        if (communications.length === 0)
            return;
        const lastCommunication = communications[0];
        const daysSinceLastContact = Math.floor((Date.now() - lastCommunication.date.getTime()) / (1000 * 60 * 60 * 24));
        // Check if we need to create an escalation
        const existingEscalation = await prisma.escalation.findFirst({
            where: {
                assetId,
                status: 'pending'
            }
        });
        // Don't create duplicate escalations
        if (existingEscalation)
            return;
        // Escalation rules
        if (daysSinceLastContact >= 14 && !lastCommunication.response) {
            // Level 2: Supervisor escalation after 14 days
            await prisma.escalation.create({
                data: {
                    assetId,
                    level: 2,
                    reason: `No response after ${daysSinceLastContact} days`,
                    status: 'pending'
                }
            });
            // Create notification for user
            const asset = await prisma.asset.findUnique({
                where: { id: assetId },
                include: { estate: true }
            });
            if (asset) {
                await prisma.notification.create({
                    data: {
                        userId: asset.estate.userId,
                        estateId: asset.estateId,
                        type: 'escalation_recommended',
                        title: 'Escalation Recommended',
                        message: `${asset.institution} has not responded in ${daysSinceLastContact} days. Consider escalating to supervisor.`,
                        actionUrl: `/assets/${assetId}`
                    }
                });
            }
        }
    }
    /**
     * Get communication statistics for an asset
     */
    async getCommunicationStats(assetId) {
        const communications = await prisma.assetCommunication.findMany({
            where: { assetId }
        });
        const totalCommunications = communications.length;
        const outboundCount = communications.filter(c => c.direction === 'outbound').length;
        const inboundCount = communications.filter(c => c.direction === 'inbound').length;
        const responsesReceived = communications.filter(c => c.response).length;
        const firstContact = communications.length > 0
            ? communications.reduce((earliest, c) => c.date < earliest ? c.date : earliest, communications[0].date)
            : null;
        const lastContact = communications.length > 0
            ? communications.reduce((latest, c) => c.date > latest ? c.date : latest, communications[0].date)
            : null;
        const daysSinceFirstContact = firstContact
            ? Math.floor((Date.now() - firstContact.getTime()) / (1000 * 60 * 60 * 24))
            : 0;
        const daysSinceLastContact = lastContact
            ? Math.floor((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24))
            : 0;
        return {
            totalCommunications,
            outboundCount,
            inboundCount,
            responsesReceived,
            responseRate: outboundCount > 0 ? (responsesReceived / outboundCount) * 100 : 0,
            firstContact,
            lastContact,
            daysSinceFirstContact,
            daysSinceLastContact
        };
    }
}
export const assetCommunicationService = new AssetCommunicationService();
//# sourceMappingURL=assetCommunicationService.js.map