import OpenAI from 'openai';
export class AiService {
    client = null;
    model;
    constructor() {
        const apiKey = process.env.LLM_API_KEY;
        const baseURL = process.env.LLM_BASE_URL; // e.g. https://api.groq.com/openai/v1 or http://localhost:11434/v1
        this.model = process.env.LLM_MODEL || 'llama3';
        if (apiKey || baseURL) {
            this.client = new OpenAI({
                apiKey: apiKey || 'dummy-key-for-ollama', // Ollama doesn't strict check API key usually, but library might require one
                baseURL: baseURL,
            });
        }
    }
    async generateDraft(data) {
        if (!this.client) {
            console.warn('AI Service not configured (missing LLM_API_KEY or LLM_BASE_URL). Returning mock response.');
            return this.generateMockDraft(data);
        }
        const prompt = this.buildPrompt(data);
        try {
            const completion = await this.client.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: this.model,
                temperature: 0.7,
            });
            return completion.choices[0]?.message?.content || 'Error: No response generated.';
        }
        catch (error) {
            console.error('LLM Generation Failed:', error);
            // Fallback to mock if API fails (e.g., rate limit, net error) guarantees user experience continuity
            return this.generateMockDraft(data, true);
        }
    }
    buildPrompt(data) {
        return `
You are an expert estate planning assistant. Write a ${data.tone} ${data.type} to ${data.recipient}.

Purpose: ${data.purpose}
Key Details to Include: ${data.keyDetails}

Rules:
- Do not include placeholders like "[Your Name]" if you can avoid it, or use generic ones like "[Executor Name]".
- Keep it concise and professional.
- Return ONLY the body of the message. Do not include introductory text like "Here is your draft:".
        `.trim();
    }
    generateMockDraft(data, isFallback = false) {
        const prefix = isFallback ? '[AI Service unavailable - showing offline draft]\n\n' : '';
        return `${prefix}Subject: Regarding ${data.purpose}

Dear ${data.recipient},

I am writing to you regarding ${data.purpose}. 
${data.keyDetails}

Please let me know if you require any further information.

Sincerely,
[Executor Name]`;
    }
    async analyzeDocument(text) {
        if (!this.client) {
            console.warn('AI Service not configured. Returning mock analysis.');
            return [{ institution: 'Mock Bank', type: 'Checking', value: '1000.00', confidence: 0.9 }];
        }
        const prompt = `
            Analyze the following text from a financial document (e.g., Tax Return, Bank Statement).
            Identify any potential assets, accounts, or income sources.
            
            Text:
            "${text.substring(0, 3000)}"

            Return ONLY a raw JSON array of objects with these fields:
            - institution (string)
            - type (string, e.g., "Bank Account", "Stock", "Real Estate")
            - value (string or null, estimate if possible)
            - confidence (number, 0-1)

            Do not include markdown formatting or code blocks. Just the JSON string.
        `.trim();
        try {
            const completion = await this.client.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: this.model,
                temperature: 0.1, // Low temperature for extraction
            });
            const content = completion.choices[0]?.message?.content || '[]';
            // Clean up if model adds markdown
            const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        }
        catch (error) {
            console.error('LLM Analysis Failed:', error);
            return [];
        }
    }
}
export const aiService = new AiService();
//# sourceMappingURL=aiService.js.map