'use server';
import {GeminiService} from '@/services/gemini-service';
import {WordsService} from '@/services/words-service';

export async function getWords() {
    const geminiService = new GeminiService();
    const wordsService = new WordsService(geminiService);
    return await wordsService.fetchWords();
}
