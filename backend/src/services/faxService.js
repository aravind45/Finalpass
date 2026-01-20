import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
const prisma = new PrismaClient();
export class FaxService {
    baseUrl;
    username;
    password;
    sessionToken = null;
    constructor() {
        this.baseUrl = process.env.PAMFAX_BASE_URL || 'https://sandbox-api.pamfax.biz';
        this.username = process.env.PAMFAX_USERNAME || '';
        this.password = process.env.PAMFAX_PASSWORD || '';
    }
    /**
     * Authenticate with PamFax API
     */
    async authenticate() {
        if (this.sessionToken) {
            return this.sessionToken;
        }
        try {
            const response = await axios.post(`${this.baseUrl}/User/Login`, {
                username: this.username,
                password: this.password
            });
            if (response.data && response.data.result && response.data.result.token) {
                this.sessionToken = response.data.result.token;
                return this.sessionToken;
            }
            throw new Error('Failed to get session token from PamFax');
        }
        catch (error) {
            console.error('PamFax authentication failed:', error.message);
            throw new Error('Failed to authenticate with fax service');
        }
    }
    /**
     * Send a fax
     */
    async sendFax(options) {
        // Save PDF to temporary location
        const tempDir = path.join(process.cwd(), 'uploads', 'faxes');
        await fs.mkdir(tempDir, { recursive: true });
        const tempFilePath = path.join(tempDir, `${Date.now()}-${options.documentName}.pdf`);
        await fs.writeFile(tempFilePath, options.pdfBuffer);
        try {
            // Create fax record in database
            const fax = await prisma.fax.create({
                data: {
                    assetId: options.assetId,
                    recipientName: options.recipientName,
                    recipientFax: options.recipientFax,
                    senderName: options.senderName,
                    senderFax: options.senderFax,
                    documentType: options.documentType,
                    documentName: options.documentName,
                    filePath: tempFilePath,
                    pageCount: options.pageCount,
                    status: 'pending'
                }
            });
            // Authenticate with PamFax
            const token = await this.authenticate();
            // Create a new fax
            const createResponse = await axios.post(`${this.baseUrl}/FaxJob/Create`, { token });
            if (!createResponse.data || !createResponse.data.result) {
                throw new Error('Failed to create fax job');
            }
            // Add recipient
            await axios.post(`${this.baseUrl}/FaxJob/AddRecipient`, {
                token,
                number: options.recipientFax.replace(/[^0-9]/g, '') // Remove non-numeric characters
            });
            // Upload file
            const fileBuffer = await fs.readFile(tempFilePath);
            const base64File = fileBuffer.toString('base64');
            await axios.post(`${this.baseUrl}/FaxJob/AddFile`, {
                token,
                file: base64File,
                filename: options.documentName
            });
            // Send the fax
            const sendResponse = await axios.post(`${this.baseUrl}/FaxJob/Send`, { token });
            const faxId = sendResponse.data?.result?.uuid || 'unknown';
            // Update fax record
            await prisma.fax.update({
                where: { id: fax.id },
                data: {
                    status: 'sending',
                    providerFaxId: faxId,
                    sentAt: new Date()
                }
            });
            // Start monitoring fax status (async)
            this.monitorFaxStatus(fax.id, faxId).catch(console.error);
            return fax.id;
        }
        catch (error) {
            console.error('Failed to send fax:', error.message);
            // Update fax record with error
            const faxRecord = await prisma.fax.findFirst({
                where: { filePath: tempFilePath },
                orderBy: { createdAt: 'desc' }
            });
            if (faxRecord) {
                await prisma.fax.update({
                    where: { id: faxRecord.id },
                    data: {
                        status: 'failed',
                        failedAt: new Date(),
                        errorMessage: error.message
                    }
                });
            }
            throw new Error(`Failed to send fax: ${error.message}`);
        }
    }
    /**
     * Monitor fax status
     */
    async monitorFaxStatus(faxId, providerFaxId) {
        const maxAttempts = 60; // Monitor for up to 30 minutes (30 second intervals)
        let attempts = 0;
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
            attempts++;
            try {
                const status = await this.getFaxStatus(providerFaxId);
                await prisma.fax.update({
                    where: { id: faxId },
                    data: {
                        status: status.status,
                        providerStatus: status.providerStatus,
                        errorMessage: status.errorMessage,
                        deliveredAt: status.deliveredAt
                    }
                });
                // Stop monitoring if fax is in final state
                if (['sent', 'failed', 'delivered'].includes(status.status)) {
                    break;
                }
            }
            catch (error) {
                console.error('Error monitoring fax status:', error);
            }
        }
    }
    /**
     * Get fax status from provider
     */
    async getFaxStatus(providerFaxId) {
        try {
            const token = await this.authenticate();
            const response = await axios.post(`${this.baseUrl}/FaxJob/GetState`, {
                token,
                uuid: providerFaxId
            });
            const state = response.data?.result?.state;
            // Map PamFax states to our states
            const statusMap = {
                'queued': 'sending',
                'sending': 'sending',
                'sent': 'sent',
                'delivered': 'delivered',
                'failed': 'failed',
                'error': 'failed'
            };
            return {
                status: statusMap[state] || 'pending',
                providerStatus: state,
                deliveredAt: state === 'delivered' ? new Date() : undefined
            };
        }
        catch (error) {
            console.error('Failed to get fax status:', error.message);
            return {
                status: 'failed',
                errorMessage: error.message
            };
        }
    }
    /**
     * Get fax by ID
     */
    async getFaxById(faxId) {
        return await prisma.fax.findUnique({
            where: { id: faxId }
        });
    }
    /**
     * Get all faxes for an asset
     */
    async getFaxesByAsset(assetId) {
        return await prisma.fax.findMany({
            where: { assetId },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Retry failed fax
     */
    async retryFax(faxId) {
        const fax = await prisma.fax.findUnique({
            where: { id: faxId }
        });
        if (!fax) {
            throw new Error('Fax not found');
        }
        if (fax.status !== 'failed') {
            throw new Error('Can only retry failed faxes');
        }
        // Read the PDF from file
        const pdfBuffer = await fs.readFile(fax.filePath);
        // Send again
        return await this.sendFax({
            assetId: fax.assetId,
            recipientName: fax.recipientName,
            recipientFax: fax.recipientFax,
            senderName: fax.senderName,
            senderFax: fax.senderFax || undefined,
            documentType: fax.documentType,
            documentName: fax.documentName,
            pdfBuffer,
            pageCount: fax.pageCount
        });
    }
    /**
     * Calculate fax cost estimate
     */
    calculateCost(pageCount) {
        const costPerPage = 0.07; // $0.07 per page
        return pageCount * costPerPage;
    }
}
export const faxService = new FaxService();
//# sourceMappingURL=faxService.js.map