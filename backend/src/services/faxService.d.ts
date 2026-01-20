interface SendFaxOptions {
    assetId: string;
    recipientName: string;
    recipientFax: string;
    senderName: string;
    senderFax?: string;
    documentType: string;
    documentName: string;
    pdfBuffer: Buffer;
    pageCount: number;
}
interface FaxStatus {
    status: 'pending' | 'sending' | 'sent' | 'failed' | 'delivered';
    providerStatus?: string;
    errorMessage?: string;
    deliveredAt?: Date;
}
export declare class FaxService {
    private baseUrl;
    private username;
    private password;
    private sessionToken;
    constructor();
    /**
     * Authenticate with PamFax API
     */
    private authenticate;
    /**
     * Send a fax
     */
    sendFax(options: SendFaxOptions): Promise<string>;
    /**
     * Monitor fax status
     */
    private monitorFaxStatus;
    /**
     * Get fax status from provider
     */
    getFaxStatus(providerFaxId: string): Promise<FaxStatus>;
    /**
     * Get fax by ID
     */
    getFaxById(faxId: string): Promise<any>;
    /**
     * Get all faxes for an asset
     */
    getFaxesByAsset(assetId: string): Promise<any>;
    /**
     * Retry failed fax
     */
    retryFax(faxId: string): Promise<string>;
    /**
     * Calculate fax cost estimate
     */
    calculateCost(pageCount: number): number;
}
export declare const faxService: FaxService;
export {};
//# sourceMappingURL=faxService.d.ts.map