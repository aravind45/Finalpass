import OpenAI from 'openai';

interface DraftRequest {
    type: 'email' | 'letter';
    recipient: string;
    purpose: string;
    tone: 'formal' | 'sympathetic' | 'stern' | 'neutral';
    keyDetails: string;
}

export class AiService {
    private client: OpenAI | null = null;
    private model: string;

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

    async generateDraft(data: DraftRequest): Promise<string> {
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
        } catch (error) {
            console.error('LLM Generation Failed:', error);
            // Fallback to mock if API fails (e.g., rate limit, net error) guarantees user experience continuity
            return this.generateMockDraft(data, true);
        }
    }

    private buildPrompt(data: DraftRequest): string {
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

    private generateMockDraft(data: DraftRequest, isFallback = false): string {
        const prefix = isFallback ? '[AI Service unavailable - showing offline draft]\n\n' : '';
        return `${prefix}Subject: Regarding ${data.purpose}

Dear ${data.recipient},

I am writing to you regarding ${data.purpose}. 
${data.keyDetails}

Please let me know if you require any further information.

Sincerely,
[Executor Name]`;
    }
}

export const aiService = new AiService();
