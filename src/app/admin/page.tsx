'use client';

import {useEffect, useState} from 'react';
import {SubmitHandler} from 'react-hook-form';
import {AddWordForm, AddWordFormInput} from './add-word-form';
import {WordsTable} from './words-table';
import {addWord} from '@/actions/add-word';
import {Word} from '@/services/gemini-service';
import {getWords} from '@/actions/get-words';
import {generateWords} from '@/actions/generate-words';
import {WordWithDefinitions} from '@/services/words-service';
import {Button} from '@/components/ui/button';

export default function Home() {
    const [words, setWords] = useState<WordWithDefinitions[]>([]);
    const onSubmit: SubmitHandler<AddWordFormInput> = async data => {
        const word: Word = {
            word: data.word,
            examples: data.examples.split(','),
            definitions: [
                {language: 'en', definition: data.definitionEN},
                {language: 'ua', definition: data.definitionUA},
                {language: 'ru', definition: data.definitionRU},
            ],
        };

        await addWord(word);
        await fetchWords();
    };

    const fetchWords = async () => {
        const _words = await getWords();
        setWords(_words);
    };

    const tryGenerateWords = async () => {
        await generateWords();

        await fetchWords();
    };

    useEffect(() => {
        void fetchWords();
    }, []);

    return (
        <div className="w-full flex flex-col">
            <div className="w-full p-4 border-b-2">
                <AddWordForm onSubmit={onSubmit} />
                <Button
                    onClick={() => {
                        void tryGenerateWords();
                    }}
                >
                    Generate with Gemini
                </Button>
            </div>
            <div>
                <WordsTable words={words} />
            </div>
        </div>
    );
}
