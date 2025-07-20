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
            <tbody>
                {words.map(word => {
                    return (
                        <tr className="p-2 border-b-2" key={word.id}>
                            <th className="px-2">{word.word}</th>
                            <td className="px-2 flex flex-col">
                                {word.definitions.map(def => {
                                    return (
                                        <p key={def.id}>
                                            <b className="pr-1">
                                                {def.language}
                                            </b>
                                            {def.definition}
                                        </p>
                                    );
                                })}
                            </td>
                            <td className="px-2">
                                {word.examples.map((example, index) => {
                                    return <p key={index}>{example}</p>;
                                })}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
