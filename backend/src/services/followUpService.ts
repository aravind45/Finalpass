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
  assetId: number;
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
    // General rules for all assets
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
    // Asset-specific rules
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

  /**
   * Get all follow-up recommendations for an estate
   */
  async getFollowUpRecommendations(estateId: number): Promise<FollowUpRecommendation[]> {
    const assets = await prisma.asset.findMany({
      where: {
        estateId,
        status: {
          notIn: ['DISTRIBUTED', 'CLOSED']
        }
      },
      include: {
        communications: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    const recommendations: FollowUpRecommendation[] = [];

    for (const asset of assets) {
      const lastCommunication = asset.communications[0];
      const lastContactDate = lastCommunication?.createdAt || asset.createdAt;
      const daysSinceContact = this.calculateDaysSince(lastContactDate);

      // Find applicable rules
      const applicableRules = this.rules.filter(rule => {
        const matchesType = rule.assetType === 'all' || rule.assetType === asset.type;
        const matchesStatus = rule.status === asset.status;
        const meetsThreshold = daysSinceContact >= rule.daysSinceLastContact;
        return matchesType && matchesStatus && meetsThreshold;
      });

      // Get highest priority rule
      if (applicableRules.length > 0) {
        const highestPriorityRule = this.getHighestPriorityRule(applicableRules);
        
        recommendations.push({
          assetId: asset.id,
          institution: asset.institution,
          assetType: asset.type,
          value: parseFloat(asset.value.toString()),
          daysSinceContact,
          lastContactDate,
          priority: highestPriorityRule.priority,
          action: highestPriorityRule.action,
          message: highestPriorityRule.message.replace('{institution}', asset.institution),
          dueDate: new Date() // Due now
        });
      }
    }

    // Sort by priority (urgent > high > medium > low)
    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Get follow-up recommendations for a specific asset
   */
  async getAssetFollowUpRecommendations(assetId: number): Promise<FollowUpRecommendation[]> {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        communications: {
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

    const lastCommunication = asset.communications[0];
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
      value: parseFloat(asset.value.toString()),
      daysSinceContact,
      lastContactDate,
      priority: rule.priority,
      action: rule.action,
      message: rule.message.replace('{institution}', asset.institution),
      dueDate: new Date()
    }));
  }

  /**
   * Check if an asset needs escalation
   */
  async needsEscalation(assetId: number): Promise<boolean> {
    const recommendations = await this.getAssetFollowUpRecommendations(assetId);
    return recommendations.some(r => r.action === 'escalate' || r.priority === 'urgent');
  }

  /**
   * Create escalation record
   */
  async createEscalation(assetId: number, reason: string, daysSinceContact: number) {
    const existingEscalation = await prisma.escalation.findFirst({
      where: {
        assetId,
        status: 'open'
      }
    });

    if (existingEscalation) {
      return existingEscalation;
    }

    const priority = daysSinceContact >= 21 ? 'urgent' : daysSinceContact >= 14 ? 'high' : 'medium';

    return await prisma.escalation.create({
      data: {
        assetId,
        reason,
        daysSinceContact,
        priority,
        status: 'open'
      }
    });
  }

  /**
   * Resolve escalation
   */
  async resolveEscalation(escalationId: number) {
    return await prisma.escalation.update({
      where: { id: escalationId },
      data: {
        status: 'resolved',
        resolvedAt: new Date()
      }
    });
  }

  /**
   * Get all open escalations for an estate
   */
  async getOpenEscalations(estateId: number) {
    return await prisma.escalation.findMany({
      where: {
        status: 'open',
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

  // Helper methods
  private calculateDaysSince(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  private getHighestPriorityRule(rules: FollowUpRule[]): FollowUpRule {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return rules.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])[0];
  }
}

export default new FollowUpService();
