
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DocumentGenService {

    /**
     * Generates a "Letter of Instruction" for closing an account.
     */
    static async generateClosureLetter(data: {
        assetId: string;
        estateId: string;
        user: { name: string; email: string }; // Executor
    }): Promise<Uint8Array> {
        // 1. Fetch Data
        const asset = await prisma.asset.findUnique({ where: { id: data.assetId } });
        const estate = await prisma.estate.findUnique({ where: { id: data.estateId } });

        if (!asset || !estate) throw new Error('Asset or Estate not found');

        // Parse JSON fields
        const deceasedInfo = JSON.parse(estate.deceasedInfo || '{}');
        const deceasedName = deceasedInfo.name || 'The Deceased';
        const dod = deceasedInfo.dateOfDeath || '[Date]';

        // 2. Create PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;

        // 3. Write Content
        let y = height - 50;
        const margin = 50;

        const writeLine = (text: string, size = fontSize, offset = 20) => {
            page.drawText(text, { x: margin, y, size, font });
            y -= offset;
        };

        // Header
        writeLine(`${data.user.name}`, 14);
        writeLine('Executor of the Estate');
        writeLine(`Ref: Estate of ${deceasedName}`);
        y -= 20;

        writeLine(`Date: ${new Date().toLocaleDateString()}`);
        y -= 20;

        // Recipient
        writeLine(`${asset.institution}`);
        writeLine('Bereavement / Estate Department');
        y -= 30;

        // Subject
        writeLine(`RE: Request to Close Account & Transfer Assets`, 12, 30);

        // Body
        writeLine(`Dear Sir/Madam,`);
        y -= 20;

        const bodyLines = [
            `I am the Court-Appointed Executor for the Estate of ${deceasedName}, who`,
            `passed away on ${dod}.`,
            ``,
            `Please accept this letter as my formal instruction to close the following account`,
            `and transfer all remaining funds to the Estate Account listed below.`,
            ``,
            `Asset Details:`,
            `  - Institution: ${asset.institution}`,
            `  - Type: ${asset.type}`,
            `  - Account Holder: ${deceasedName}`,
            `  - Value (Approx): $${asset.value || 'Unknown'}`,
            ``,
            `Enclosed with this fax, please find:`,
            `  1. Death Certificate`,
            `  2. Letters Testamentary (Court Appointment)`,
            ``,
            `Please process this request immediately. If you require additional forms,`,
            `fax them to me at +1 (555) 000-0000 or email ${data.user.email}.`
        ];

        for (const line of bodyLines) {
            writeLine(line);
        }

        // Signoff
        y -= 30;
        writeLine(`Sincerely,`);
        y -= 40;
        writeLine(`_________________________`);
        writeLine(`${data.user.name}`);
        writeLine(`Executor`);

        // 4. Save
        return await pdfDoc.save();
    }
}
