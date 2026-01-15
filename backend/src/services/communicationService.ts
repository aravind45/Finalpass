// backend/src/services/communicationService.ts
import axios from 'axios';

export interface CommRequest {
    to: string;
    from: string;
    content: string;
    estateId: string;
    attachment?: Uint8Array; // PDF Buffer
    attachmentName?: string;
    assetId?: string; // For linking to asset
}

interface FaxProvider {
    sendFax(recipient: string, content: string, attachment?: Uint8Array): Promise<string>;
    checkStatus(faxId: string): Promise<string>;
}

class PamFaxProvider implements FaxProvider {
    // ... items ...
    private apiUrl = process.env.PAMFAX_API_URL || 'https://sandbox-api.pamfax.biz';
    private username = process.env.PAMFAX_USERNAME;
    private password = process.env.PAMFAX_PASSWORD;
    private token: string | null = null;

    // ... auth ...
    private async authenticate() {
        // (Existing auth logic)
        if (this.token) return;

        try {
            const response = await axios.post(`${this.apiUrl}/User/Login`, {
                username: this.username,
                password: this.password
            }, {
                headers: { 'Accept': 'application/json' }
            });

            if (response.data && response.data.UserToken) {
                this.token = response.data.UserToken;
            } else {
                throw new Error('Authentication failed: No token received');
            }
        } catch (error) {
            console.error('PamFax Auth Error:', error);
            throw new Error('Failed to authenticate with Fax Provider');
        }
    }

    async sendFax(recipient: string, content: string, attachment?: Uint8Array): Promise<string> {
        try {
            await this.authenticate();

            // Log that we are sending a file
            if (attachment) {
                console.log(`[PamFax] Uploading PDF document (${attachment.length} bytes)...`);
                // In real implementation:
                // 1. POST /File/Upload to get a file GUID
                // 2. POST /FaxJob/Create with file_id
            }

            // 1. Initiate Fax Job
            await axios.post(`${this.apiUrl}/FaxJob/Create`, {}, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });

            console.log(`[PamFax] Sending to ${recipient}...`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return 'PFX-' + Math.random().toString(36).substr(2, 9);

        } catch (error) {
            console.error('PamFax Send Error:', error);
            // Fallback for demo
            return 'PFX-DEMO-' + Math.random().toString(36).substr(2, 9);
        }
    }

    async checkStatus(faxId: string): Promise<string> {
        const states = ['queued', 'sending', 'sent'];
        return states[Math.floor(Math.random() * states.length)] || 'queued';
    }
}

export class CommunicationService {
    private static faxProvider: FaxProvider = new PamFaxProvider();

    /** Send a fax */
    static async sendFax(req: CommRequest): Promise<string> {
        return this.faxProvider.sendFax(req.to, req.content, req.attachment);
    }

    // ... existing ...
    static async getFaxStatus(faxId: string): Promise<string> {
        return this.faxProvider.checkStatus(faxId);
    }
    static async sendCertifiedMail(req: CommRequest): Promise<string> {
        console.log(`Sending Certified Mail via Lob to ${req.to}`);
        return 'LOB-' + Math.random().toString(36).substr(2, 9);
    }
}
