'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

const AddUnit = () => {
    const params = useParams();
    const router = useRouter();

    const [unitname, setUnitName] = useState('');
    const [modulid, setModulId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (params?.modulId) {
            setModulId(params.modulId as string);
        }
    }, [params]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/unit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unitname,
                    modulid,
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

        setUnitName('');
    };

    return (
        <div className="py-10">
            <h1 className="text-xl text-center font-bold mb-4">So'z qo'shish</h1>

            <form onSubmit={handleSubmit} className="space-y-4 w-[90%] sm:w-[500px] mx-auto">
                <div>
                    <label className="block">Modul id:</label>
                    <input
                        type="text"
                        value={modulid}
                        readOnly
                        className="border px-4 py-2 w-full bg-gray-100 text-gray-600"
                    />
                </div>

                <div>
                    <label className="block">Unit nomi:</label>
                    <input
                        type="text"
                        value={unitname}
                        onChange={(e) => setUnitName(e.target.value)}
                        className="border px-4 py-2 w-full"
                        required
                    />
                </div>

                <div className='mx-auto flex flex-col sm:flex-row justify-center items-center gap-3'>
                    <button className="bg-blue-500 cursor-pointer w-full text-white px-4 py-2 rounded">
                        Add
                    </button>
                    <button onClick={() => router.back()} type="button" className="bg-blue-500 cursor-pointer w-full text-white px-4 py-2 rounded">
                        Back
                    </button>
                </div>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
};

export default AddUnit;
