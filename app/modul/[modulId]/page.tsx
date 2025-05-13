'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'

type UnitData = {
  unitid: number;
  unitname: string;
  modulid: number;
};

interface PageProps {
  params: Promise<{
    modulId: string;
  }>;
}

const UnitPage = ({ params }: PageProps) => {
  const [unitList, setUnitList] = useState<UnitData[]>([]);
  const [modulId, setModulId] = useState<string | null>(null);

  // Unwrap params
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setModulId(resolvedParams.modulId);
    };
    unwrapParams();
  }, [params]);

  // Fetch units by modulId
  useEffect(() => {
    const fetchData = async () => {
      if (!modulId) return;
      try {
        const response = await fetch(`/api/unit?modulId=${modulId}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setUnitList(data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    fetchData();
  }, [modulId]);
  const router = useRouter();

  return (
    <div className="text-lg sm:text-xl flex justify-center items-center flex-col sm:flex-row mx-auto p-5 sm:p-14 gap-10 relative">
      <div className=' absolute top-0 my-3 sm:m-5 sm:right-0 mx-auto'>
        <Link href={``}>
          <button onClick={() => router.back()} className=' w-[115px] h-[40px] mr-2 cursor-pointer middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-[10px] sm:text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'>
            Back
          </button>
        </Link>
        <Link href={`/modul/${modulId}/add-unit`}>
          <button className=" w-[115px] h-[40px] cursor-pointer middle none center ml-2 rounded-lg bg-blue-500 py-3 px-6 font-sans text-[10px] sm:text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
            Add Unit
          </button>
        </Link>
      </div>

      <div className="mt-20 mx-10 py-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-3 justify-items-start">
        {unitList.map((unit) => (
          <Link href={`/modul/${modulId}/unit/${unit.unitid}`} key={unit.unitid}>
            <button className=" cursor-pointer w-[150px] h-[40px] middle none center px-2 rounded-lg border border-blue-500 font-sans text-xs font-bold uppercase text-blue-500 transition-all hover:opacity-75 focus:ring focus:ring-blue-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none truncate">
              {unit.unitname}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UnitPage;
