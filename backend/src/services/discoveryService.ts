
import { aiService } from './aiService.js';

export interface DiscoveredAsset {
    institution: string;
    type: string;
    value?: string;
    confidence: number;
    sourceDocument?: string;
}

export class DiscoveryService {
    /**
     * Analyze a document text to find potential assets
     */
    static async scanDocument(text: string, documentName: string): Promise<DiscoveredAsset[]> {
        console.log(`Analyzing document: ${documentName}`);

        try {
            const results = await aiService.analyzeDocument(text);

            // Enrich with source metadata
            return results.map((r: any) => ({
                ...r,
                sourceDocument: documentName
            }));
        } catch (error) {
            console.error('Discovery scan failed:', error);
            return [];
        }
    }

    /**
     * Simulation helper: Simulates OCR text from a file type
     */
    static simulateOcr(fileType: string): string {
        if (fileType.includes('tax')) {
            return `
                1040 U.S. Individual Income Tax Return
                ...
                DIVIDEND INCOME:
                - VANGUARD GROUP: $1,250.00
                - FIDELITY INVESTMENTS: $400.00
                ...
                INTEREST INCOME:
                - CHASE BANK NA: $12.50
            `;
        }
        return "Generic document text with no identifiable assets.";
    }
}
