import { aiService } from './aiService.js';
export class AdvocacyService {
    /** Generate an escalation letter */
    static async generateEscalationLetter(ctx) {
        console.log(`Drafting escalation for ${ctx.institution}`);
        const promptDetails = `
            Institution: ${ctx.institution}
            Account Type: ${ctx.accountType}
            Days Silent: ${ctx.daysSilent}
            Executor: ${ctx.executorName}
            
            Context: The institution has been unresponsive to previous requests to close the account or transfer assets. 
            This is a formal escalation.
        `.trim();
        return await aiService.generateDraft({
            type: 'letter',
            recipient: `Compliance Officer at ${ctx.institution}`,
            purpose: 'Formal Complaint regarding Unresponsive Estate Settlement Request',
            tone: 'stern',
            keyDetails: promptDetails
        });
    }
}
//# sourceMappingURL=advocacyService.js.map