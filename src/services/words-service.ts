import {Prisma} from '@/generated/prisma';
import {prisma} from '@/lib/prisma';
import {Word} from '@/services/gemini-service';

const wordWithDefinitionsArgs = {
    include: {
        definitions: true,
    },
};
export type WordWithDefinitions = Prisma.WordGetPayload<
    typeof wordWithDefinitionsArgs
>;

export class WordsService {
    async fetchWords(): Promise<WordWithDefinitions[]> {
        return await prisma.word.findMany(wordWithDefinitionsArgs);
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
