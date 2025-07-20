'use server';
import {Word} from '@/services/gemini-service';
import {WordsService} from '@/services/words-service';

export async function addWord(word: Word) {
    const wordsService = new WordsService();
    return await wordsService.addWords([word]);
}
