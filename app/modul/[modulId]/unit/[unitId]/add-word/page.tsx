'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const AddWord = () => {
    const params = useParams();
    const router = useRouter();

    const [unitId, setUnitId] = useState('');
    const [wordEng, setWordEng] = useState('');
    const [wordUzb, setWordUzb] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (params?.unitId) {
            setUnitId(params.unitId as string);
        }
    }, [params]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/vocab', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wordEng,
                    wordUzb,
                    unitId,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setMessage('Soʻz muvaffaqiyatli qoʻshildi!');
            } else {
                setMessage('Xatolik yuz berdi.');
            }
        } catch (error) {
            console.error('There was an error!', error);
        }

        setWordEng('');
        setWordUzb('');
    };

    return (
        <div className="py-10">
            <h1 className="text-xl text-center font-bold mb-4">So'z qo'shish</h1>

            <form onSubmit={handleSubmit} className="space-y-4 w-[90%] sm:w-[500px] mx-auto">

                <div>
                    <label className="block">Unit ID:</label>
                    <input
                        type="text"
                        value={unitId}
                        readOnly
                        className="border px-4 py-2 w-full bg-gray-100 text-gray-600"
                    />
                </div>

                <div>
                    <label className="block">Inglizcha so'z:</label>
                    <input
                        type="text"
                        value={wordEng}
                        onChange={(e) => setWordEng(e.target.value)}
                        className="border px-4 py-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block">O'zbekcha so'z:</label>
                    <input
                        type="text"
                        value={wordUzb}
                        onChange={(e) => setWordUzb(e.target.value)}
                        className="border px-4 py-2 w-full"
                        required
                    />
                </div>

                <div className='mx-auto flex flex-col sm:flex-row justify-start items-center gap-3'>
                    <button type="submit" className=" w-full bg-blue-500 text-white px-4 py-2 rounded">
                        Add
                    </button>
                    <button type="button" onClick={() => router.back()} className=" w-full bg-blue-500 text-white px-4 py-2 rounded">
                        Back
                    </button>
                </div>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
};

export default AddWord;
