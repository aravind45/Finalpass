export declare class DocumentGenService {
    /**
     * Generates a "Letter of Instruction" for closing an account.
     */
    static generateClosureLetter(data: {
        assetId: string;
        estateId: string;
        user: {
            name: string;
            email: string;
        };
    }): Promise<Uint8Array>;
}
//# sourceMappingURL=documentGenService.d.ts.map