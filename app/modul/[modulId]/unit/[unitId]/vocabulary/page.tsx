'use client'

import Link from 'next/link';
import React from 'react'
import { useEffect, useState } from "react";
import { FC } from 'react';
import { useRouter } from 'next/navigation'
import useTTS from '@/hooks/useTTS'


interface PageProps {
  params: Promise<{
    modulId: string;
    unitId: string;
  }>;
}

type VocabData = {
  wordid: number;
  wordeng: string;
  worduzb: string;
  wordcomment: string | null;
  unitid: number | null;
};

const Vocabulary: FC<PageProps> = ({ params }) => {
  const [vocabList, setVocabList] = useState<VocabData[]>([])
  const [modulId, setModulId] = useState<string | null>(null)
  const [unitId, setUnitId] = useState<string | null>(null)
  const router = useRouter();
  const { handleNormalSpeech } = useTTS()


  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setModulId(resolvedParams.modulId);
      setUnitId(resolvedParams.unitId);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      if (!unitId || !modulId) return;
      try {
        const response = await fetch(`/api/vocab?unitid=${unitId}&modulid=${modulId}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        setVocabList(data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    fetchData();
  }, [unitId, modulId]);

  const handleDelete = async (wordid: number) => {
    const confirmed = confirm("Are you sure you want to delete this word?");
    if (!confirmed) return;

    try {
      const response = await fetch('/api/vocab', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordid })
      });

      if (response.ok) {
        setVocabList(prev => prev.filter(word => word.wordid !== wordid));
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };
  console.log(vocabList);


  return (
    <div className=' relative'>
      <div className="px-2 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className=' px-2'>
                <th
                  className=" px-2 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center sm:text-left text-[12px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  №
                </th>
                <th
                  className=" px-2 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center sm:text-left text-[12px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  English
                </th>
                <th
                  className=" px-2 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center sm:text-left text-[12px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Uzbek
                </th>
                <th
                  className=" px-2 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center sm:text-left text-[12px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider truncate">
                  Functions
                </th>
              </tr>
            </thead>
            <tbody>
              {vocabList.map((word, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-[12px] sm:text-xl">
                    <p className="text-gray-900 whitespace-no-wrap">{index + 1}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-[12px] sm:text-xl">
                    <button
                      className=' cursor-pointer'
                      onClick={evt => handleNormalSpeech(evt, word.wordeng)}
                    >
                      <p className="text-gray-900 whitespace-no-wrap">{word.wordeng.charAt(0).toUpperCase() + word.wordeng.slice(1)}</p>
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-[12px] sm:text-xl">
                    <p className="text-gray-900 whitespace-no-wrap">{word.worduzb.charAt(0).toUpperCase() + word.worduzb.slice(1)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex flex-col sm:flex-row items-center gap-2">
                    <span
                      className="relative px-3 py-1 font-semibold text-green-900 leading-tight">
                      <span aria-hidden
                        className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                      <Link href={`/modul/${modulId}/unit/${unitId}/vocabulary/${word.wordid}/show-more`} className=' relative'>
                        <span className=' hidden sm:block'>Show More</span>
                        <img width="20" height="20" src="https://img.icons8.com/pulsar-gradient/20/visible.png" alt="visible" className=' block sm:hidden' />
                      </Link>
                    </span>
                    <span
                      className="relative px-3 py-1 font-semibold text-red-900 leading-tight">
                      <span aria-hidden
                        className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                      <button className="relative cursor-pointer" onClick={() => handleDelete(word.wordid)}>
                        <span className=' hidden sm:block'>Delete</span>
                        <img width="20" height="20" src="https://img.icons8.com/color/20/delete-forever.png" alt="delete-forever" className=' block sm:hidden' />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className=" w-full absolute -bottom-20 px-5 py-5 bg-white shadow-md flex flex-col xs:flex-row items-center xs:justify-between">
        <div className="inline-flex mt-2 xs:mt-0">
          <button
            className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">
            Prev
          </button>
          &nbsp; &nbsp;
          <button
            onClick={() => router.back()}
            className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded">
            Back to unit
          </button>
          &nbsp; &nbsp;
          <button
            className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Vocabulary