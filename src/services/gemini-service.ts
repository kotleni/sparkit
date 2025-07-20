import {GoogleGenAI, Type} from '@google/genai';

const MODEL = 'gemini-2.5-flash-lite-preview-06-17';

class PromptBuilder {
    private lines: string[] = [];

    append(line: string) {
        this.lines.push(line);
    }

    build(): string {
        return this.lines.join('\n');
    }
}

function createPrompt(
    wordsCount: number,
    exceptions: string[] = [],
    examplesCount: number = 3,
    language: string = 'english',
    definitionLanguages: string[],
) {
    const builder = new PromptBuilder();
    builder.append(`generate array of popular ${language} words`);
    builder.append('surround target word in examples with *');
    builder.append(
        `examples should have minimum ${examplesCount} items and each should have target word`,
    );
    builder.append(
        'examples and defintions for all words should be fully different',
    );
    builder.append(`Give me ${wordsCount} words`);
    builder.append(
        `Definitions for languages: ${definitionLanguages.join(',')}`,
    );
    if (exceptions.length > 0)
        builder.append(`Except this words: ${exceptions.join(',')}`);
    return builder.build();
}

export interface WordDefinition {
    language: string;
    definition: string;
}

export interface Word {
    word: string;
    definitions: WordDefinition[];
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
                        required: ['word', 'definitions', 'examples'],
                        properties: {
                            word: {
                                type: Type.STRING,
                            },
                            definitions: {
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

    async generateEnglishWords(
        count: number,
        exceptions: string[] = [],
    ): Promise<GeneratedWords> {
        const prompt = createPrompt(count, exceptions, 3, 'english', [
            'en',
            'ua',
            'ru',
        ]);

        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: prompt,
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
        // console.log(response.text);
        return json as GeneratedWords;
    }
}
