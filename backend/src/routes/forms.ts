import express from 'express';
import { formService } from '../services/formService.js';
import { faxService } from '../services/faxService.js';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Apply auth middleware to all routes
router.use(requireAuth);

/**
 * GET /api/forms
 * Get all available forms
 */
router.get('/', async (req, res) => {
    try {
        const forms = await formService.getForms();
        res.json({ success: true, forms });
    } catch (error: any) {
        console.error('Failed to get forms:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/forms/institution/:institution
 * Get forms for a specific institution
 */
router.get('/institution/:institution', async (req, res) => {
    try {
        const { institution } = req.params;
        const forms = await formService.getFormsByInstitution(institution);
        res.json({ success: true, forms });
    } catch (error: any) {
        console.error('Failed to get forms:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/forms/:formId
 * Get form details by ID
 */
router.get('/:formId', async (req, res) => {
    try {
        const { formId } = req.params;
        const form = await formService.getFormById(formId);
        
        if (!form) {
            return res.status(404).json({ success: false, error: 'Form not found' });
        }

        res.json({ success: true, form });
    } catch (error: any) {
        console.error('Failed to get form:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/forms/:formId/auto-populate
 * Auto-populate form with estate data
 */
router.post('/:formId/auto-populate', async (req, res) => {
    try {
        const { formId } = req.params;
        const { estateId, assetId } = req.body;

        // Get estate data
        const estate = await prisma.estate.findUnique({
            where: { id: estateId },
            include: { user: true }
        });

        if (!estate) {
            return res.status(404).json({ success: false, error: 'Estate not found' });
        }

        // Get asset data if provided
        let asset = null;
        if (assetId) {
            asset = await prisma.asset.findUnique({
                where: { id: assetId }
            });
        }

        // Parse JSON fields
        const estateData = {
            ...estate,
            deceasedInfo: estate.deceasedInfo ? JSON.parse(estate.deceasedInfo) : {},
            user: estate.user
        };

        const assetData = asset ? {
            ...asset,
            metadata: asset.metadata ? JSON.parse(asset.metadata) : {}
        } : null;

        // Auto-populate form
        const data = await formService.autoPopulateForm(formId, estateData, assetData);

        res.json({ success: true, data });
    } catch (error: any) {
        console.error('Failed to auto-populate form:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/forms/:formId/fill
 * Fill a form with provided data and return PDF
 */
router.post('/:formId/fill', async (req, res) => {
    try {
        const { formId } = req.params;
        const { data } = req.body;

        // Validate form data
        const validation = await formService.validateFormData(formId, data);
        if (!validation.valid) {
            return res.status(400).json({ 
                success: false, 
                error: 'Validation failed',
                errors: validation.errors 
            });
        }

        // Fill the form
        const pdfBuffer = await formService.fillForm(formId, data);

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${formId}-filled.pdf"`);
        res.send(pdfBuffer);
    } catch (error: any) {
        console.error('Failed to fill form:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/forms/:formId/fax
 * Fill form and send via fax
 */
router.post('/:formId/fax', async (req, res) => {
    try {
        const { formId } = req.params;
        const { assetId, data, coverPageNotes } = req.body;

        // Get form metadata
        const form = await formService.getFormById(formId);
        if (!form) {
            return res.status(404).json({ success: false, error: 'Form not found' });
        }

        // Get asset
        const asset = await prisma.asset.findUnique({
            where: { id: assetId },
            include: {
                estate: {
                    include: { user: true }
                }
            }
        });

        if (!asset) {
            return res.status(404).json({ success: false, error: 'Asset not found' });
        }

        // Validate form data
        const validation = await formService.validateFormData(formId, data);
        if (!validation.valid) {
            return res.status(400).json({ 
                success: false, 
                error: 'Validation failed',
                errors: validation.errors 
            });
        }

        // Fill the form
        const filledPdf = await formService.fillForm(formId, data);

        // Generate cover page if required
        let finalPdf = filledPdf;
        let pageCount = form.pageCount;

        if (form.faxInfo.coverPageRequired) {
            const coverPage = await formService.generateCoverPage({
                to: form.faxInfo.recipientName,
                toFax: form.faxInfo.recipientFax,
                from: asset.estate.user.name,
                subject: `${form.name} - ${asset.institution}`,
                pageCount: form.pageCount,
                notes: coverPageNotes
            });

            finalPdf = await formService.mergePDFs(coverPage, filledPdf);
            pageCount += 1; // Add cover page
        }

        // Send fax
        const faxId = await faxService.sendFax({
            assetId: asset.id,
            recipientName: form.faxInfo.recipientName,
            recipientFax: form.faxInfo.recipientFax,
            senderName: asset.estate.user.name,
            documentType: formId,
            documentName: form.name,
            pdfBuffer: finalPdf,
            pageCount
        });

        // Calculate cost
        const cost = faxService.calculateCost(pageCount);

        res.json({ 
            success: true, 
            faxId,
            pageCount,
            estimatedCost: cost,
            message: 'Fax sent successfully. You will receive a notification when it is delivered.'
        });
    } catch (error: any) {
        console.error('Failed to send fax:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/forms/fax/:faxId
 * Get fax status
 */
router.get('/fax/:faxId', async (req, res) => {
    try {
        const { faxId } = req.params;
        const fax = await faxService.getFaxById(faxId);

        if (!fax) {
            return res.status(404).json({ success: false, error: 'Fax not found' });
        }

        res.json({ success: true, fax });
    } catch (error: any) {
        console.error('Failed to get fax:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/forms/fax/asset/:assetId
 * Get all faxes for an asset
 */
router.get('/fax/asset/:assetId', async (req, res) => {
    try {
        const { assetId } = req.params;
        const faxes = await faxService.getFaxesByAsset(assetId);

        res.json({ success: true, faxes });
    } catch (error: any) {
        console.error('Failed to get faxes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/forms/fax/:faxId/retry
 * Retry a failed fax
 */
router.post('/fax/:faxId/retry', async (req, res) => {
    try {
        const { faxId } = req.params;
        const newFaxId = await faxService.retryFax(faxId);

        res.json({ 
            success: true, 
            faxId: newFaxId,
            message: 'Fax retry initiated'
        });
    } catch (error: any) {
        console.error('Failed to retry fax:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
