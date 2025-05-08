'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const addModul = () => {
    const [modulName, setModulName] = useState('')
    const [modulId, setModulId] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/modul', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    modulName,
                    modulId,
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

        setModulName('')
        setModulId('')
    };
    const router = useRouter();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">So'z qo'shish</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block">Modul id:</label>
                    <input
                        type="number"
                        value={modulId}
                        onChange={(e) => setModulId(e.target.value)}
                        className="border px-4 py-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block">Modul nomi:</label>
                    <input
                        type="text"
                        value={modulName}
                        onChange={(e) => setModulName(e.target.value)}
                        className="border px-4 py-2 w-full"
                        required
                    />
                </div>

                <div className=' mx-auto flex flex-col sm:flex-row justify-center items-center gap-3'>
                    <button className="w-full bg-blue-500 text-white px-4 py-2 rounded">
                        Add
                    </button>
                    <button onClick={() => router.back()} className="w-full bg-blue-500 text-white px-4 py-2 rounded">
                        Back
                    </button>
                </div>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    )
}

export default addModul