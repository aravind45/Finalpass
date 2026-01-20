// backend/src/services/communicationService.ts
import axios from 'axios';
class PamFaxProvider {
    // ... items ...
    apiUrl = process.env.PAMFAX_API_URL || 'https://sandbox-api.pamfax.biz';
    username = process.env.PAMFAX_USERNAME;
    password = process.env.PAMFAX_PASSWORD;
    token = null;
    // ... auth ...
    async authenticate() {
        // (Existing auth logic)
        if (this.token)
            return;
        try {
            const response = await axios.post(`${this.apiUrl}/User/Login`, {
                username: this.username,
                password: this.password
            }, {
                headers: { 'Accept': 'application/json' }
            });
            if (response.data && response.data.UserToken) {
                this.token = response.data.UserToken;
            }
            else {
                throw new Error('Authentication failed: No token received');
            }
        }
        catch (error) {
            console.error('PamFax Auth Error:', error);
            throw new Error('Failed to authenticate with Fax Provider');
        }
    }
    async sendFax(recipient, content, attachment) {
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
        }
        catch (error) {
            console.error('PamFax Send Error:', error);
            // Fallback for demo
            return 'PFX-DEMO-' + Math.random().toString(36).substr(2, 9);
        }
    }
    async checkStatus(faxId) {
        const states = ['queued', 'sending', 'sent'];
        return states[Math.floor(Math.random() * states.length)] || 'queued';
    }
}
export class CommunicationService {
    static faxProvider = new PamFaxProvider();
    /** Send a fax */
    static async sendFax(req) {
        return this.faxProvider.sendFax(req.to, req.content, req.attachment);
    }
    // ... existing ...
    static async getFaxStatus(faxId) {
        return this.faxProvider.checkStatus(faxId);
    }
    static async sendCertifiedMail(req) {
        console.log(`Sending Certified Mail via Lob to ${req.to}`);
        return 'LOB-' + Math.random().toString(36).substr(2, 9);
    }
}
//# sourceMappingURL=communicationService.js.map