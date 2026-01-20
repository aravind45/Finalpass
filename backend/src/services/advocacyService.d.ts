export interface AdvocacyContext {
    institution: string;
    accountType: string;
    daysSilent: number;
    executorName: string;
}
export declare class AdvocacyService {
    /** Generate an escalation letter */
    static generateEscalationLetter(ctx: AdvocacyContext): Promise<string>;
}
//# sourceMappingURL=advocacyService.d.ts.map