export declare class DocumentService {
    createDocument(data: {
        estateId: string;
        type: string;
        fileName: string;
        filePath: string;
        fileSize: number;
        mimeType: string;
    }): Promise<any>;
    getDocuments(estateId: string): Promise<any>;
}
export declare const documentService: DocumentService;
//# sourceMappingURL=documentService.d.ts.map