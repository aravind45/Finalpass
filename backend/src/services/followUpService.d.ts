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
export declare class FollowUpService {
    private rules;
    /**
     * Get all follow-up recommendations for an estate
     */
    getFollowUpRecommendations(estateId: number): Promise<FollowUpRecommendation[]>;
    /**
     * Get follow-up recommendations for a specific asset
     */
    getAssetFollowUpRecommendations(assetId: number): Promise<FollowUpRecommendation[]>;
    /**
     * Check if an asset needs escalation
     */
    needsEscalation(assetId: number): Promise<boolean>;
    /**
     * Create escalation record
     */
    createEscalation(assetId: number, reason: string, daysSinceContact: number): Promise<any>;
    /**
     * Resolve escalation
     */
    resolveEscalation(escalationId: number): Promise<any>;
    /**
     * Get all open escalations for an estate
     */
    getOpenEscalations(estateId: number): Promise<any>;
    private calculateDaysSince;
    private getHighestPriorityRule;
}
declare const _default: FollowUpService;
export default _default;
//# sourceMappingURL=followUpService.d.ts.map