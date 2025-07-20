'use server';

import {GeminiService} from '@/services/gemini-service';
import {WordsService} from '@/services/words-service';

export async function generateWords() {
    const wordsService = new WordsService();
    const geminiService = new GeminiService();
    const generatedWords = await geminiService.generateEnglishWords();
    await wordsService.addWords(generatedWords.words);
}
