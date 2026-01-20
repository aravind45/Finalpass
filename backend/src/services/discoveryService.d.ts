export interface DiscoveredAsset {
    institution: string;
    type: string;
    value?: string;
    confidence: number;
    sourceDocument?: string;
}
export declare class DiscoveryService {
    /**
     * Analyze a document text to find potential assets
     */
    static scanDocument(text: string, documentName: string): Promise<DiscoveredAsset[]>;
    /**
     * Simulation helper: Simulates OCR text from a file type
     */
    static simulateOcr(fileType: string): string;
}
//# sourceMappingURL=discoveryService.d.ts.map