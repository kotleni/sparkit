import {WordWithDefinitions} from '@/services/words-service';

interface WordsTableProps {
    words: WordWithDefinitions[];
}

export function WordsTable({words}: WordsTableProps) {
    return (
        <table className="p-4 w-full">
            <thead className="bg-accent">
                <tr>
                    <th scope="col">Word</th>
                    <th scope="col">English Definition</th>
                    <th scope="col">One example</th>
                </tr>
            </thead>
            {words.map(word => {
                return (
                    <tr className="p-2" key={word.id}>
                        <th className="px-2">{word.word}</th>
                        <td className="px-2">
                            {word.definitions[0].definition}
                        </td>
                        <td className="px-2">{word.examples[0]}</td>
                    </tr>
                );
            })}
        </table>
    );
}
