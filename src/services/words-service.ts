import {prisma} from '@/lib/prisma';
import {Word} from './gemini-service';

export class WordsService {
    async fetchWords() {
        return await prisma.word.findMany({
            include: {
                definitions: true,
            },
        });
    }

    async addWords(words: Word[]) {
        for (const word of words) {
            await prisma.word.create({
                data: {
                    word: word.word,
                    examples: word.examples,
                    definitions: {
                        create: word.definitions.map(def => ({
                            language: def.language,
                            definition: def.definition,
                        })),
                    },
                },
            });
        }
    }
}
