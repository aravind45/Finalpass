import { PDFDocument, PDFForm, PDFTextField, PDFCheckBox, PDFDropdown } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class FormService {
    formsDir;
    metadata = null;
    constructor() {
        this.formsDir = path.join(__dirname, '../../forms');
    }
    /**
     * Load form metadata
     */
    async loadMetadata() {
        if (this.metadata) {
            return this.metadata;
        }
        try {
            const metadataPath = path.join(this.formsDir, 'metadata.json');
            const content = await fs.readFile(metadataPath, 'utf-8');
            this.metadata = JSON.parse(content);
            return this.metadata;
        }
        catch (error) {
            console.error('Failed to load form metadata:', error);
            throw new Error('Form metadata not found');
        }
    }
    /**
     * Get all available forms
     */
    async getForms() {
        const metadata = await this.loadMetadata();
        return metadata.forms;
    }
    /**
     * Get form by ID
     */
    async getFormById(formId) {
        const metadata = await this.loadMetadata();
        return metadata.forms.find(f => f.id === formId) || null;
    }
    /**
     * Get forms for a specific institution
     */
    async getFormsByInstitution(institution) {
        const metadata = await this.loadMetadata();
        return metadata.forms.filter(f => f.institution.toLowerCase() === institution.toLowerCase());
    }
    /**
     * Fill a PDF form with data
     */
    async fillForm(formId, data) {
        const form = await this.getFormById(formId);
        if (!form) {
            throw new Error(`Form not found: ${formId}`);
        }
        // Load the PDF
        const pdfPath = path.join(this.formsDir, form.institution.toLowerCase(), form.fileName);
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pdfForm = pdfDoc.getForm();
        // Fill form fields
        for (const field of form.fields) {
            const value = data[field.id];
            if (value === undefined || value === null)
                continue;
            try {
                // Try to find and fill the field
                // Note: This is a simplified version. Real implementation would need
                // to map field IDs to actual PDF field names
                const fieldName = field.id;
                if (field.type === 'checkbox') {
                    const checkBox = pdfForm.getCheckBox(fieldName);
                    if (value === true) {
                        checkBox.check();
                    }
                    else {
                        checkBox.uncheck();
                    }
                }
                else if (field.type === 'select') {
                    const dropdown = pdfForm.getDropdown(fieldName);
                    dropdown.select(value);
                }
                else {
                    const textField = pdfForm.getTextField(fieldName);
                    textField.setText(value);
                }
            }
            catch (error) {
                // Field might not exist in PDF, skip it
                console.warn(`Could not fill field ${field.id}:`, error);
            }
        }
        // Flatten the form (make it non-editable)
        pdfForm.flatten();
        // Save the filled PDF
        const filledPdfBytes = await pdfDoc.save();
        return Buffer.from(filledPdfBytes);
    }
    /**
     * Auto-populate form data from estate information
     */
    async autoPopulateForm(formId, estateData, assetData) {
        const form = await this.getFormById(formId);
        if (!form) {
            throw new Error(`Form not found: ${formId}`);
        }
        const data = {};
        for (const field of form.fields) {
            if (!field.estateField)
                continue;
            try {
                const value = this.getNestedValue({ ...estateData, asset: assetData }, field.estateField);
                if (value !== undefined && value !== null) {
                    data[field.id] = value;
                }
            }
            catch (error) {
                console.warn(`Could not auto-populate field ${field.id}:`, error);
            }
        }
        return data;
    }
    /**
     * Generate a cover page for fax
     */
    async generateCoverPage(options) {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([612, 792]); // Letter size
        const { width, height } = page.getSize();
        const fontSize = 12;
        const margin = 50;
        let yPosition = height - margin;
        // Title
        page.drawText('FAX COVER SHEET', {
            x: margin,
            y: yPosition,
            size: 18,
        });
        yPosition -= 40;
        // To section
        page.drawText(`TO: ${options.to}`, {
            x: margin,
            y: yPosition,
            size: fontSize,
        });
        yPosition -= 20;
        page.drawText(`FAX: ${options.toFax}`, {
            x: margin,
            y: yPosition,
            size: fontSize,
        });
        yPosition -= 40;
        // From section
        page.drawText(`FROM: ${options.from}`, {
            x: margin,
            y: yPosition,
            size: fontSize,
        });
        yPosition -= 20;
        if (options.fromFax) {
            page.drawText(`FAX: ${options.fromFax}`, {
                x: margin,
                y: yPosition,
                size: fontSize,
            });
            yPosition -= 20;
        }
        page.drawText(`DATE: ${new Date().toLocaleDateString()}`, {
            x: margin,
            y: yPosition,
            size: fontSize,
        });
        yPosition -= 40;
        // Subject
        page.drawText(`RE: ${options.subject}`, {
            x: margin,
            y: yPosition,
            size: fontSize,
        });
        yPosition -= 20;
        page.drawText(`PAGES: ${options.pageCount + 1} (including cover)`, {
            x: margin,
            y: yPosition,
            size: fontSize,
        });
        yPosition -= 40;
        // Notes
        if (options.notes) {
            page.drawText('NOTES:', {
                x: margin,
                y: yPosition,
                size: fontSize,
            });
            yPosition -= 20;
            // Wrap notes text
            const maxWidth = width - (margin * 2);
            const words = options.notes.split(' ');
            let line = '';
            for (const word of words) {
                const testLine = line + word + ' ';
                if (testLine.length * 6 > maxWidth) {
                    page.drawText(line, {
                        x: margin,
                        y: yPosition,
                        size: fontSize,
                    });
                    yPosition -= 20;
                    line = word + ' ';
                }
                else {
                    line = testLine;
                }
            }
            if (line) {
                page.drawText(line, {
                    x: margin,
                    y: yPosition,
                    size: fontSize,
                });
            }
        }
        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
    /**
     * Merge cover page with form PDF
     */
    async mergePDFs(coverPage, formPdf) {
        const coverDoc = await PDFDocument.load(coverPage);
        const formDoc = await PDFDocument.load(formPdf);
        const mergedDoc = await PDFDocument.create();
        // Copy cover page
        const [copiedCoverPage] = await mergedDoc.copyPages(coverDoc, [0]);
        mergedDoc.addPage(copiedCoverPage);
        // Copy all form pages
        const formPageCount = formDoc.getPageCount();
        const copiedFormPages = await mergedDoc.copyPages(formDoc, Array.from({ length: formPageCount }, (_, i) => i));
        copiedFormPages.forEach(page => mergedDoc.addPage(page));
        const mergedPdfBytes = await mergedDoc.save();
        return Buffer.from(mergedPdfBytes);
    }
    /**
     * Get nested value from object using dot notation
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    /**
     * Validate form data
     */
    async validateFormData(formId, data) {
        const form = await this.getFormById(formId);
        if (!form) {
            return { valid: false, errors: ['Form not found'] };
        }
        const errors = [];
        for (const field of form.fields) {
            if (field.required && !data[field.id]) {
                errors.push(`${field.label} is required`);
            }
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
export const formService = new FormService();
//# sourceMappingURL=formService.js.map