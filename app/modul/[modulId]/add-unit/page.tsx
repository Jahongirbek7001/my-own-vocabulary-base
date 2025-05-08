'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const addUnit = () => {
    const [unitName, setUnitName] = useState('')
    const [modulId, setModulId] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/unit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unitName,
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

        setUnitName('')
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
                    <label className="block">Unit nomi:</label>
                    <input
                        type="text"
                        value={unitName}
                        onChange={(e) => setUnitName(e.target.value)}
                        className="border px-4 py-2 w-full"
                        required
                    />
                </div>

                <div className=' mx-auto flex flex-col sm:flex-row justify-center items-center gap-3'>
                    <button className="bg-blue-500 cursor-pointer w-full text-white px-4 py-2 rounded">
                        Add
                    </button>
                    <button onClick={() => router.back()} className="bg-blue-500 cursor-pointer w-full text-white px-4 py-2 rounded">
                        Back
                    </button>
                </div>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    )
}

export default addUnit