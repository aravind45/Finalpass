import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createPlaceholderForm(fileName: string, title: string, fields: any[]) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const font = await pdfDoc.embedFont('Helvetica');
    const boldFont = await pdfDoc.embedFont('Helvetica-Bold');

    const { width, height } = page.getSize();
    let y = height - 50;

    // Header
    page.drawText('FIDELITY INVESTMENTS - PLACEHOLDER FORM', {
        x: 50,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.4, 0.1),
    });
    y -= 30;

    page.drawText(title, {
        x: 50,
        y,
        size: 14,
        font: boldFont,
    });
    y -= 40;

    const form = pdfDoc.getForm();

    for (const field of fields) {
        page.drawText(field.label, {
            x: 50,
            y,
            size: 10,
            font,
        });

        if (field.type === 'text' || field.type === 'date' || field.type === 'textarea') {
            const textField = form.createTextField(field.id);
            textField.setText('');
            textField.addToPage(page, {
                x: 200,
                y: y - 5,
                width: 300,
                height: 20,
            });
        } else if (field.type === 'checkbox') {
            const checkBox = form.createCheckBox(field.id);
            checkBox.addToPage(page, {
                x: 200,
                y: y - 5,
                width: 20,
                height: 20,
            });
        } else if (field.type === 'select') {
            const dropdown = form.createDropdown(field.id);
            dropdown.setOptions(field.options || []);
            dropdown.addToPage(page, {
                x: 200,
                y: y - 5,
                width: 300,
                height: 20,
            });
        }

        y -= 30;
        if (y < 50) {
            // Add new page if needed (simplified for placeholder)
            break;
        }
    }

    const pdfBytes = await pdfDoc.save();
    const dir = path.join(__dirname, '../forms/fidelity');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, fileName), pdfBytes);
    console.log(`Generated ${fileName}`);
}

async function run() {
    const metadataPath = path.join(__dirname, '../forms/metadata.json');
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));

    for (const form of metadata.forms) {
        if (form.institution === 'Fidelity') {
            await createPlaceholderForm(form.fileName, form.name, form.fields);
        }
    }
}

run().catch(console.error);
