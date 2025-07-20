import {Prisma} from '@/generated/prisma';
import {prisma} from '@/lib/prisma';
import {GeminiService, Word} from '@/services/gemini-service';

const DESIRED_BATCH_SIZE = 20;
const MAX_GENERATION_ATTEMPTS = 4;

const wordWithDefinitionsArgs = {
    include: {
        definitions: true,
    },
};
export type WordWithDefinitions = Prisma.WordGetPayload<
    typeof wordWithDefinitionsArgs
>;

export class WordsService {
    constructor(private geminiService: GeminiService) {}

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

    async generateUniqueWords() {
        const finalWords: Word[] = [];
        const attemptedWords = new Set<string>();
        let attempts = 0;

        console.log(
            `Generating unique ${DESIRED_BATCH_SIZE} words by max ${MAX_GENERATION_ATTEMPTS} iterations.`,
        );

        // Make some tries to fetch target count of new words
        while (
            finalWords.length < DESIRED_BATCH_SIZE &&
            attempts < MAX_GENERATION_ATTEMPTS
        ) {
            attempts++;
            const neededCount = DESIRED_BATCH_SIZE - finalWords.length;
            const candidates = (
                await this.geminiService.generateEnglishWords(neededCount)
            ).words;

            // Prepare raw words list
            const candidateTexts = candidates.map(c => c.word.toLowerCase());
            candidateTexts.forEach(text => attemptedWords.add(text));

            // Find new words
            const existingDbWords = await prisma.word.findMany({
                where: {word: {in: candidateTexts, mode: 'insensitive'}},
                select: {word: true},
            });
            const existingDbWordSet = new Set(
                existingDbWords.map(w => w.word.toLowerCase()),
            );

            const newUniqueWords = candidates.filter(
                c => !existingDbWordSet.has(c.word.toLowerCase()),
            );

            finalWords.push(...newUniqueWords);
            console.log(
                `Attempt ${attempts}: Found ${newUniqueWords.length} new words. Total so far: ${finalWords.length}`,
            );
        }

        if (finalWords.length > 0) {
            const wordsToInsert = finalWords.slice(0, DESIRED_BATCH_SIZE);

            await this.addWords(wordsToInsert);

            console.log(
                `Successfully added ${wordsToInsert.length} new words to the database.`,
            );
            return;
        }

        console.log('No new unique words were generated to add.');
        return;
    }
}
