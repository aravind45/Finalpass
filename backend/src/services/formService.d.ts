interface FormMetadata {
    id: string;
    name: string;
    institution: string;
    description: string;
    fileName: string;
    pageCount: number;
    fields: FormField[];
    faxInfo: {
        recipientName: string;
        recipientFax: string;
        coverPageRequired: boolean;
    };
}
interface FormField {
    id: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'checkbox' | 'textarea';
    page: number;
    required: boolean;
    estateField?: string;
    options?: string[];
}
interface FormFillData {
    [key: string]: string | boolean;
}
export declare class FormService {
    private formsDir;
    private metadata;
    constructor();
    /**
     * Load form metadata
     */
    loadMetadata(): Promise<{
        forms: FormMetadata[];
    }>;
    /**
     * Get all available forms
     */
    getForms(): Promise<FormMetadata[]>;
    /**
     * Get form by ID
     */
    getFormById(formId: string): Promise<FormMetadata | null>;
    /**
     * Get forms for a specific institution
     */
    getFormsByInstitution(institution: string): Promise<FormMetadata[]>;
    /**
     * Fill a PDF form with data
     */
    fillForm(formId: string, data: FormFillData): Promise<Buffer>;
    /**
     * Auto-populate form data from estate information
     */
    autoPopulateForm(formId: string, estateData: any, assetData?: any): Promise<FormFillData>;
    /**
     * Generate a cover page for fax
     */
    generateCoverPage(options: {
        to: string;
        toFax: string;
        from: string;
        fromFax?: string;
        subject: string;
        pageCount: number;
        notes?: string;
    }): Promise<Buffer>;
    /**
     * Merge cover page with form PDF
     */
    mergePDFs(coverPage: Buffer, formPdf: Buffer): Promise<Buffer>;
    /**
     * Get nested value from object using dot notation
     */
    private getNestedValue;
    /**
     * Validate form data
     */
    validateFormData(formId: string, data: FormFillData): Promise<{
        valid: boolean;
        errors: string[];
    }>;
}
export declare const formService: FormService;
export {};
//# sourceMappingURL=formService.d.ts.map