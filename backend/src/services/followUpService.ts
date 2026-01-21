import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FollowUpRule {
  assetType: string;
  status: string;
  daysSinceLastContact: number;
  action: 'remind' | 'escalate' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
}

interface FollowUpRecommendation {
  assetId: string;
  institution: string;
  assetType: string;
  value: number;
  daysSinceContact: number;
  lastContactDate: Date | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action: string;
  message: string;
  dueDate: Date;
}

export class FollowUpService {
  private rules: FollowUpRule[] = [
    {
      assetType: 'all',
      status: 'CONTACTED',
      daysSinceLastContact: 7,
      action: 'remind',
      priority: 'medium',
      message: 'It\'s been 7 days since you contacted {institution}. Consider following up on the status.'
    },
    {
      assetType: 'all',
      status: 'CONTACTED',
      daysSinceLastContact: 14,
      action: 'escalate',
      priority: 'high',
      message: 'No response from {institution} in 14 days. Time to escalate with a formal letter.'
    },
    {
      assetType: 'all',
      status: 'DOCUMENTS_SUBMITTED',
      daysSinceLastContact: 10,
      action: 'remind',
      priority: 'medium',
      message: 'Documents submitted 10 days ago. Check on review status with {institution}.'
    },
    {
      assetType: 'all',
      status: 'DOCUMENTS_SUBMITTED',
      daysSinceLastContact: 21,
      action: 'escalate',
      priority: 'high',
      message: 'Documents under review for 21 days. This is longer than typical. Escalate to supervisor.'
    },
    {
      assetType: 'all',
      status: 'IN_REVIEW',
      daysSinceLastContact: 14,
      action: 'remind',
      priority: 'medium',
      message: 'Claim in review for 14 days. Follow up on expected completion date.'
    },
    {
      assetType: 'all',
      status: 'APPROVED',
      daysSinceLastContact: 7,
      action: 'alert',
      priority: 'urgent',
      message: 'Distribution approved but not received. Contact {institution} immediately about transfer.'
    },
    {
      assetType: '401k',
      status: 'CONTACTED',
      daysSinceLastContact: 30,
      action: 'escalate',
      priority: 'urgent',
      message: '401(k) claim pending 30 days. File complaint with Department of Labor.'
    },
    {
      assetType: 'life_insurance',
      status: 'CONTACTED',
      daysSinceLastContact: 30,
      action: 'escalate',
      priority: 'urgent',
      message: 'Life insurance claim pending 30 days. File complaint with state insurance commissioner.'
    }
  ];

  async getFollowUpRecommendations(estateId: string): Promise<FollowUpRecommendation[]> {
    const assets = await prisma.asset.findMany({
      where: {
        estateId,
        status: {
          notIn: ['DISTRIBUTED', 'CLOSED']
        }
      },
      include: {
        assetCommunications: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    const recommendations: FollowUpRecommendation[] = [];

    for (const asset of assets) {
      const lastCommunication = asset.assetCommunications[0];
      const lastContactDate = lastCommunication?.createdAt || asset.createdAt;
      const daysSinceContact = this.calculateDaysSince(lastContactDate);

      const applicableRules = this.rules.filter(rule => {
        const matchesType = rule.assetType === 'all' || rule.assetType === asset.type;
        const matchesStatus = rule.status === asset.status;
        const meetsThreshold = daysSinceContact >= rule.daysSinceLastContact;
        return matchesType && matchesStatus && meetsThreshold;
      });

      if (applicableRules.length > 0) {
        const highestPriorityRule = this.getHighestPriorityRule(applicableRules);

        recommendations.push({
          assetId: asset.id,
          institution: asset.institution,
          assetType: asset.type,
          value: asset.value ? parseFloat(asset.value.toString()) : 0,
          daysSinceContact,
          lastContactDate,
          priority: highestPriorityRule.priority,
          action: highestPriorityRule.action,
          message: highestPriorityRule.message.replace('{institution}', asset.institution),
          dueDate: new Date()
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async getAssetFollowUpRecommendations(assetId: string): Promise<FollowUpRecommendation[]> {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        assetCommunications: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!asset) {
      return [];
    }

    const lastCommunication = asset.assetCommunications[0];
    const lastContactDate = lastCommunication?.createdAt || asset.createdAt;
    const daysSinceContact = this.calculateDaysSince(lastContactDate);

    const applicableRules = this.rules.filter(rule => {
      const matchesType = rule.assetType === 'all' || rule.assetType === asset.type;
      const matchesStatus = rule.status === asset.status;
      const meetsThreshold = daysSinceContact >= rule.daysSinceLastContact;
      return matchesType && matchesStatus && meetsThreshold;
    });

    return applicableRules.map(rule => ({
      assetId: asset.id,
      institution: asset.institution,
      assetType: asset.type,
      value: asset.value ? parseFloat(asset.value.toString()) : 0,
      daysSinceContact,
      lastContactDate,
      priority: rule.priority,
      action: rule.action,
      message: rule.message.replace('{institution}', asset.institution),
      dueDate: new Date()
    }));
  }

  async needsEscalation(assetId: string): Promise<boolean> {
    const recommendations = await this.getAssetFollowUpRecommendations(assetId);
    return recommendations.some(r => r.action === 'escalate' || r.priority === 'urgent');
  }

  async createEscalation(assetId: string, reason: string, level: number) {
    const existingEscalation = await prisma.escalation.findFirst({
      where: {
        assetId,
        status: 'pending'
      }
    });

    if (existingEscalation) {
      return existingEscalation;
    }

    return await prisma.escalation.create({
      data: {
        assetId,
        level,
        reason,
        status: 'pending'
      }
    });
  }

  async resolveEscalation(escalationId: string) {
    return await prisma.escalation.update({
      where: { id: escalationId },
      data: {
        status: 'resolved',
        resolvedDate: new Date()
      }
    });
  }

  async getOpenEscalations(estateId: string) {
    return await prisma.escalation.findMany({
      where: {
        status: 'pending',
        asset: {
          estateId
        }
      },
      include: {
        asset: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  private calculateDaysSince(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  private getHighestPriorityRule(rules: FollowUpRule[]): FollowUpRule {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const sorted = rules.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    if (sorted.length === 0) {
      throw new Error('No rules provided to getHighestPriorityRule');
    }
    return sorted[0]!; // Non-null assertion since we checked length
  }
}

export default new FollowUpService();
