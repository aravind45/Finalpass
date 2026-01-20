export interface CreateCommunicationInput {
    assetId: string;
    type: 'initial_contact' | 'follow_up' | 'escalation' | 'response';
    method: 'email' | 'phone' | 'fax' | 'mail' | 'portal';
    direction: 'inbound' | 'outbound';
    subject?: string;
    content: string;
    response?: string;
    responseDate?: Date;
    nextActionDate?: Date;
    nextActionType?: string;
    createdById: string;
}
export interface UpdateCommunicationInput {
    response?: string;
    responseDate?: Date;
    nextActionDate?: Date;
    nextActionType?: string;
}
export declare class AssetCommunicationService {
    /**
     * Create a new communication record for an asset
     */
    createCommunication(input: CreateCommunicationInput): Promise<any>;
    /**
     * Get all communications for an asset
     */
    getCommunications(assetId: string): Promise<any>;
    /**
     * Update a communication record (e.g., add response)
     */
    updateCommunication(communicationId: string, input: UpdateCommunicationInput): Promise<any>;
    /**
     * Delete a communication record
     */
    deleteCommunication(communicationId: string): Promise<any>;
    /**
     * Get communication timeline for an asset
     */
    getCommunicationTimeline(assetId: string): Promise<any[]>;
    /**
     * Get next action recommendations for an asset
     */
    getNextActions(assetId: string): Promise<{
        type: string;
        priority: string;
        message: string;
        suggestedAction: any;
        dueDate: any;
    }[]>;
    /**
     * Update asset metadata with last contact date
     */
    private updateAssetLastContact;
    /**
     * Check if escalation is needed based on communication history
     */
    private checkEscalationNeeded;
    /**
     * Get communication statistics for an asset
     */
    getCommunicationStats(assetId: string): Promise<{
        totalCommunications: any;
        outboundCount: any;
        inboundCount: any;
        responsesReceived: any;
        responseRate: number;
        firstContact: any;
        lastContact: any;
        daysSinceFirstContact: number;
        daysSinceLastContact: number;
    }>;
}
export declare const assetCommunicationService: AssetCommunicationService;
//# sourceMappingURL=assetCommunicationService.d.ts.map