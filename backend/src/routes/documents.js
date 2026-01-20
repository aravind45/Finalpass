import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { documentService } from '../services/documentService.js';
import { estateService } from '../services/estateService.js';
import { authService } from '../services/authService.js';
import { documentTemplateService } from '../services/documentTemplateService.js';
const router = Router();
// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
// Middleware
const requireAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'No token provided' });
    try {
        const user = await authService.verifyToken(token);
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
// POST /api/documents/upload
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
    try {
        console.log("Upload endpoint hit");
        if (!req.file) {
            console.log("No file received");
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        const userId = req.user.id;
        console.log("User ID:", userId);
        const estate = await estateService.getORCreateHomeEstate(userId);
        console.log("Estate found/created:", estate.id);
        const { type } = req.body;
        console.log("File info:", req.file.originalname, type);
        const document = await documentService.createDocument({
            estateId: estate.id,
            type: type || 'OTHER', // User selected type from the table
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });
        console.log("Document created in DB:", document.id);
        res.json({ success: true, document });
    }
    catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ success: false, error: 'Upload failed' });
    }
});
// GET /api/documents
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const estate = await estateService.getORCreateHomeEstate(userId);
        const documents = await documentService.getDocuments(estate.id);
        res.json({ success: true, documents });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Fetch failed' });
    }
});
// POST /api/documents/generate – generate PDF from template
router.post('/generate', requireAuth, async (req, res) => {
    let { estateId, template } = req.body;
    try {
        if (!estateId) {
            const userId = req.user.id;
            const estate = await estateService.getORCreateHomeEstate(userId);
            estateId = estate.id;
        }
        const pdfBytes = await documentTemplateService.generateDocumentPdf(estateId, template);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${template}.pdf`);
        res.send(Buffer.from(pdfBytes));
    }
    catch (error) {
        console.error('Document generation error:', error);
        res.status(500).json({ success: false, error: error.message || 'Generation failed' });
    }
});
export default router;
//# sourceMappingURL=documents.js.map