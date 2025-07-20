import {Word} from '@/generated/prisma';

interface WordsTableProps {
    words: Word[];
}

export function WordsTable({words}: WordsTableProps) {
    return (
        <ul className="p-4">
            {words.map(word => {
                return <li key={word.id}>{word.word}</li>;
            })}
        </ul>
    );
}
