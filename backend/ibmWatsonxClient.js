const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

class WatsonxClient {
    constructor() {
        this.apiKey = process.env.IBM_CLOUD_API_KEY;
        this.projectId = process.env.WATSONX_PROJECT_ID;
        this.serviceUrl = process.env.WATSONX_SERVICE_URL || 'https://us-south.ml.cloud.ibm.com';
        this.modelId = 'ibm/granite-3-8b-instruct'; // Stable workhorse for RAG

        // Initialize Supabase for RAG
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        this.watsonx = null;
    }

    _initWatsonx() {
        if (this.watsonx) return;

        if (!this.apiKey || this.apiKey === 'your_ibm_cloud_api_key_here') {
            throw new Error('IBM_CLOUD_API_KEY is missing or not configured in .env');
        }
        if (!this.projectId || this.projectId === 'your_project_id_here') {
            throw new Error('WATSONX_PROJECT_ID is missing or not configured in .env');
        }

        console.log(`[Sheff Brain] Initializing WatsonX Granite 3.0. URL: ${this.serviceUrl}`);

        const { IamAuthenticator } = require('ibm-cloud-sdk-core');
        this.watsonx = WatsonXAI.newInstance({
            version: '2023-05-29',
            serviceUrl: this.serviceUrl,
            authenticator: new IamAuthenticator({
                apikey: this.apiKey,
            }),
        });
    }

    async _getSocietyContext(prompt) {
        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            // 1. Get upcoming events (Future only)
            const { data: events } = await this.supabase
                .from('events')
                .select('title, date, description')
                .gte('date', today)
                .order('date', { ascending: true })
                .limit(5);

            // 2. Search glossary for technical terms
            const { data: glossary } = await this.supabase
                .from('glossary')
                .select('term, definition')
                .limit(15);

            // 3. Get Members/Leadership (Increased limit to skip cutoff)
            const { data: members } = await this.supabase
                .from('members')
                .select('name, role, linkedin, bio')
                .limit(30);

            let context = "=== SDS KNOWLEDGE BASE START ===\n";

            if (events?.length) {
                context += "UPCOMING EVENTS (FILTERED FOR FUTURE):\n" + events.map(e => `- ${e.title} (${e.date}): ${e.description}`).join('\n') + "\n\n";
            } else {
                context += "UPCOMING EVENTS: No events currently scheduled in the future.\n\n";
            }

            if (members?.length) {
                context += "SOCIETY TEAM/LEADERSHIP:\n" + members.map(m => `- ${m.name}: ${m.role} (${m.bio || ''})`).join('\n') + "\n\n";
            }

            // Simple term matching for glossary
            const matchedTerms = glossary?.filter(g => prompt.toLowerCase().includes(g.term.toLowerCase()));
            if (matchedTerms?.length) {
                context += "RELEVANT GLOSSARY:\n" + matchedTerms.map(g => `- ${g.term}: ${g.definition}`).join('\n') + "\n\n";
            }

            context += "=== SDS KNOWLEDGE BASE END ===";
            return context;
        } catch (error) {
            console.error('Error fetching society context:', error);
            return "NO SDS DATA AVAILABLE.";
        }
    }

    async generateResponse(prompt, history = []) {
        try {
            this._initWatsonx();

            // Get fresh context from Supabase RAG
            const societyContext = await this._getSocietyContext(prompt);

            const systemPrompt = `You are Sheff, the official Assistant of SheffDataSoc.
Your personality: Professional, sharp, and helpful.
CURRENT DATE: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

SOCIETY CONTACT DETAILS (HARD FACTS):
- Official Website: sheffdatasoc.org
- Contact Email: datascience@sheffield.ac.uk

STYLE RULES:
- Be concise. Get straight to the point.
- ALWAYS use double line breaks (\\n\\n) between paragraphs for readability.
- Avoid flowery language or repeated greetings.

IDENTITY:
- If someone asks what model you are or who developed you, proudly state that you are an AI assistant developed by IBM Research and powered by the IBM Granite 3.0 model, customized for SheffDataSoc.

STRICT KNOWLEDGE RULES:
1. Use ONLY the "SOCIETY CONTACT DETAILS" and the "SDS KNOWLEDGE BASE" provided below.
2. If the answer is not in the knowledge base, say: "I'm sorry, I don't have information about that in my current records. Please visit our website at sheffdatasoc.org!"
3. NEVER mention any other society, organization, or website (e.g., chemasoc, etc.). 
4. NEVER make up dates, locations, emails, or society info.
5. You are the AI for SheffDataSoc ONLY. Do not act as an assistant for any other group.
6. The knowledge base only contains FUTURE events. If a user asks about an event from 2024 and it's not in the list, assume it has already passed.
7. If off-topic, politely pivot back to SheffDataSoc.

${societyContext}`;

            const params = {
                modelId: this.modelId,
                projectId: this.projectId,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...history.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    { role: 'user', content: prompt }
                ],
                maxTokens: 500,
                stop: ['user', 'USER', 'Assistant:']
            };

            const response = await this.watsonx.textChat(params);

            if (response.result && response.result.choices && response.result.choices[0]) {
                return response.result.choices[0].message.content.trim();
            } else {
                throw new Error('Unexpected response format from WatsonX');
            }
        } catch (error) {
            console.error('WatsonX Error:', error.message);
            if (error.response?.data) {
                console.error('WatsonX Error Detail:', JSON.stringify(error.response.data, null, 2));
            }
            throw error;
        }
    }
}

module.exports = new WatsonxClient();
