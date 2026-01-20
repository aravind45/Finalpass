export interface CommRequest {
    to: string;
    from: string;
    content: string;
    estateId: string;
    attachment?: Uint8Array;
    attachmentName?: string;
    assetId?: string;
}
export declare class CommunicationService {
    private static faxProvider;
    /** Send a fax */
    static sendFax(req: CommRequest): Promise<string>;
    static getFaxStatus(faxId: string): Promise<string>;
    static sendCertifiedMail(req: CommRequest): Promise<string>;
}
//# sourceMappingURL=communicationService.d.ts.map