"use client";

import Link from "next/link";

const IrregularVerbs = () => {

    return (
        <>
            <main className=" text-lg xl:text-xl flex justify-center items-center flex-col xl:flex-row mx-auto p-24 gap-3">
                <button className="h-full w-[200px] border-2 border-gray-300 p-3 rounded-lg shadow-lg bg-white">
                    <Link href={`/irregular-verbs/vocabulary`}>
                        <img src="/gif/dictionary.gif" className=" w-full" alt="sx" />
                        <span>VOCABULARY</span>
                    </Link>
                </button>
            </main>
        </>
    )
}

export default IrregularVerbs