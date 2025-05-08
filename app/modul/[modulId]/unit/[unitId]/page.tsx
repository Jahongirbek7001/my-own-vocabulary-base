'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Params {
    modulId: number;
    unitId: number;
}

interface VocabularyProps {
    params: Promise<Params>; // bu Promise bo‘lganligi sababli async ochamiz
}

const Unit = ({ params }: VocabularyProps) => {
    const [modulId, setModulId] = useState<number | null>(null);
    const [unitId, setUnitId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unwrapParams = async () => {
            const resolved = await params;
            setModulId(resolved.modulId);
            setUnitId(resolved.unitId);
        };

        unwrapParams();
    }, [params]);

    if (modulId === null || unitId === null) return <p>Loading...</p>;

    return (
        <main className="text-lg sm:text-xl flex justify-center items-center flex-col sm:flex-row mx-auto p-5 sm:p-14 gap-10 relative">
            <div className=' absolute top-0 my-3 sm:m-5 sm:right-0 mx-auto'>
                <Link href={``}>
                    <button onClick={() => router.back()} className=' w-[115px] h-[40px] mr-2 cursor-pointer middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-[10px] sm:text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'>
                        Back
                    </button>
                </Link>
                <Link href={`/modul/${modulId}/unit/${unitId}/add-word`}>
                    <button className=' w-[120px] h-[40px] ml-2 cursor-pointer middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-[10px] sm:text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'>
                        Add Word
                    </button>
                </Link>

            </div>
            <div className=' flex justify-center items-center gap-5 mt-16 sm:mt-20 flex-col sm:flex-row'>
                <button className="h-full w-[200px] border-2 border-gray-300 p-3 rounded-lg shadow-lg bg-white">
                    <Link href={`/modul/${modulId}/unit/${unitId}/vocabulary`}>
                        <img src="/gif/dictionary.gif" className="w-full" alt="sx" />
                        <span>VOCABULARY</span>
                    </Link>
                </button>
                <button className="h-full w-[200px] border-2 border-gray-300 p-3 rounded-lg shadow-lg bg-white">
                    <Link href={`/modul/${modulId}/unit/${unitId}/quiz`}>
                        <img src="/gif/brain.gif" className="w-full" alt="sx" />
                        <span>QUIZ</span>
                    </Link>
                </button>
            </div>
        </main>
    );
};

export default Unit;