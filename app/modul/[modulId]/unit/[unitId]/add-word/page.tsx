'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const addWord = () => {
    const [unitId, setUnitId] = useState('')
    const [wordEng, setWordEng] = useState('')
    const [wordUzb, setWordUzb] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()

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
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">So'z qo'shish</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block">Unit id:</label>
                    <input
                        type="number"
                        value={unitId}
                        onChange={(e) => setUnitId(e.target.value)}
                        className="border px-4 py-2 w-full"
                        required
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

                <div className=' mx-auto flex flex-col sm:flex-row justify-center items-center gap-3'>
                    <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
                        Add
                    </button>
                    <button type="submit" className=" w-full bg-blue-500 text-white px-4 py-2 rounded" onClick={() => router.back()}>
                        Back
                    </button>
                </div>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    )
}

export default addWord