interface DraftRequest {
    type: 'email' | 'letter';
    recipient: string;
    purpose: string;
    tone: 'formal' | 'sympathetic' | 'stern' | 'neutral';
    keyDetails: string;
}
export declare class AiService {
    private client;
    private model;
    constructor();
    generateDraft(data: DraftRequest): Promise<string>;
    private buildPrompt;
    private generateMockDraft;
    analyzeDocument(text: string): Promise<any[]>;
}
export declare const aiService: AiService;
export {};
//# sourceMappingURL=aiService.d.ts.map