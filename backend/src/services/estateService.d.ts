export declare class EstateService {
    /**
     * Get the primary estate for a user, or create the "Demo" estate if none exists.
     * This ensures the user sees the "John Doe" example from the requirements immediately.
     */
    getORCreateHomeEstate(userId: string): Promise<any>;
    /**
     * Create the "John Doe" estate exactly as specified in estate-lifecycle-mvp-spec.md
     */
    private createDemoEstate;
    /**
     * Retrieve a single estate by its ID, including related assets.
     */
    getEstateById(estateId: string): Promise<any>;
}
export declare const estateService: EstateService;
//# sourceMappingURL=estateService.d.ts.map