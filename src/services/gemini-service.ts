import {GoogleGenAI, Type} from '@google/genai';

const MODEL = 'gemini-2.5-flash-lite-preview-06-17';
const PROMPT = `generate random popular english words, surround target word  in examples with *
examples should be minimum 3 items, and all have target world
give me 20 words
definitions for en, ua, ru`;

export interface WordDefinition {
    language: string;
    definition: string;
}

export interface Word {
    word: string;
    definitons: WordDefinition[];
    examples: string[];
}

export interface GeneratedWords {
    words: Word[];
}

export class GeminiService {
    private ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    private config = {
        thinkingConfig: {
            thinkingBudget: 0,
        },
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            required: ['words'],
            properties: {
                words: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        required: ['word', 'definitons', 'examples'],
                        properties: {
                            word: {
                                type: Type.STRING,
                            },
                            definitons: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    required: ['language', 'definition'],
                                    properties: {
                                        language: {
                                            type: Type.STRING,
                                        },
                                        definition: {
                                            type: Type.STRING,
                                        },
                                    },
                                },
                            },
                            examples: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING,
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    async generateEnglishWords(): Promise<GeneratedWords> {
        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: PROMPT,
                    },
                ],
            },
        ];
        const response = await this.ai.models.generateContent({
            model: MODEL,
            config: this.config,
            contents,
        });
        const json = JSON.parse(response.text ?? '[]');
        console.log(response.text);
        return json as GeneratedWords;
    }
}
