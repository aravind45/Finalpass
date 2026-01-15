// backend/src/services/documentTemplateService.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { estateService } from './estateService.js';
import { prisma } from '../prisma/client.js';

/**
 * Render a Handlebars template with the given context.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function renderTemplate(templateName: string, context: any): string {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    return template(context);
}

/**
 * Generate a simple PDF from plain‑text content.
 * For now we embed the rendered text line‑by‑line.
 */
async function createPdfFromText(text: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    const margin = 50;
    const maxWidth = width - margin * 2;

    const sanitized = text.replace(/[^\x00-\x7F]/g, "").replace(/\r/g, '');
    console.log('PDF Text Length:', sanitized.length);
    console.log('PDF Text Preview:', sanitized.substring(0, 100));

    let y = height - margin;
    const paragraphs = sanitized.split('\n');

    for (const paragraph of paragraphs) {
        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const textWidth = font.widthOfTextAtSize(testLine, fontSize);

            if (textWidth <= maxWidth) {
                currentLine = testLine;
            } else {
                page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
                y -= lineHeight;
                currentLine = word;

                if (y < margin) {
                    page = pdfDoc.addPage();
                    y = height - margin;
                }
            }
        }
        if (currentLine) {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= lineHeight;
            if (y < margin) {
                page = pdfDoc.addPage();
                y = height - margin;
            }
        }
    }
    return await pdfDoc.save();
}

/**
 * Public API – generate a PDF for a given estate and template.
 * Currently only "will" is supported.
 */
export async function generateDocumentPdf(estateId: string, templateName: string): Promise<Uint8Array> {
    const estate = await estateService.getEstateById(estateId);
    if (!estate) throw new Error('Estate not found');

    // Load related data needed for the template (assets, user)
    const [assets, user] = await Promise.all([
        prisma.asset.findMany({ where: { estateId } }),
        prisma.user.findUnique({ where: { id: estate.userId } }),
    ]);

    const context = {
        estate: {
            name: estate.name,
            deceasedInfo: estate.deceasedInfo,
            user: { name: user?.name ?? 'Unknown' },
            assets,
        },
        date: new Date().toLocaleDateString(),
    };

    const rendered = renderTemplate(templateName, context);
    const pdfBytes = await createPdfFromText(rendered);
    return pdfBytes;
}

export const documentTemplateService = { generateDocumentPdf };
