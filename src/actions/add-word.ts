'use server';
import {GeminiService, Word} from '@/services/gemini-service';
import {WordsService} from '@/services/words-service';

export async function addWord(word: Word) {
    const geminiService = new GeminiService();
    const wordsService = new WordsService(geminiService);
    return await wordsService.addWords([word]);
}
