/**
 * Public API – generate a PDF for a given estate and template.
 * Currently only "will" is supported.
 */
export declare function generateDocumentPdf(estateId: string, templateName: string): Promise<Uint8Array>;
export declare const documentTemplateService: {
    generateDocumentPdf: typeof generateDocumentPdf;
};
//# sourceMappingURL=documentTemplateService.d.ts.map