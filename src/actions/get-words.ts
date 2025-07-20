'use server';
import {WordsService} from '@/services/words-service';

export async function getWords() {
    const wordsService = new WordsService();
    return await wordsService.fetchWords();
}
