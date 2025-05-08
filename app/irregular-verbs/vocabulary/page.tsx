"use client";
import { useEffect, useState } from "react";
import { useRef } from "react";

type Irregular = {
    id: number;
    verb1: string;
    verb2: string;
    verb3: string;
    verbUzb: string;
};

const IrregularVocabulary = () => {
    const [data, setData] = useState<Irregular[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const audioRefsUk = useRef<(HTMLAudioElement | null)[][]>([]); // 2D array of refs

    const handlePlayUk = (index: number, verbIndex: number) => {
        if (audioRefsUk.current[index] && audioRefsUk.current[index][verbIndex]) {
            audioRefsUk.current[index][verbIndex]?.play();
        }
    };

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/irregular-verbs.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData: Irregular[]) => setData(jsonData))
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="px-4 sm:px-8 py-4 overflow-x-auto mt-10">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th
                                    className=" w-[50px] px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    №
                                </th>
                                <th
                                    className="px-5 py-3 border-b-2 border-green-200 bg-green-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Verb I
                                </th>
                                <th
                                    className="px-5 py-3 border-b-2 border-yellow-200 bg-yellow-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Verb II
                                </th>
                                <th
                                    className="px-5 py-3 border-b-2 border-blue-200 bg-blue-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Verb III
                                </th>
                                <th
                                    className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Uzbek
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((word, index) => (
                                <tr key={index}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{index + 1}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-green-100 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{word.verb1}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-yellow-100 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{word.verb2}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-blue-100 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{word.verb3}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{word.verbUzb}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default IrregularVocabulary;
