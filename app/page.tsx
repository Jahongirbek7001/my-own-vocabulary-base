'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

type ModulData = {
  modulid: number;
  modulname: string;
};

export default function Home() {
  const [modul, setModul] = useState<ModulData[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/modul`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: any = await response.json();
        setModul(data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    fetchData();
  }, []);
  console.log("modul", modul);



  return (
    <main className="text-lg xl:text-xl mx-auto p-5 relative">
      <div className=' absolute top-0 m-5 right-0'>
        <Link href={`/add-modul`}>
          <button className=" w-[115px] sm:w-full h-[40px] cursor-pointer middle none center ml-2 rounded-lg bg-blue-500 py-3 px-6 font-sans text-[10px] sm:text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
            Add Modul
          </button>
        </Link>
      </div>
      <div className="mt-20 py-10 grid grid-cols-1 text-xl sm:grid-cols-5 gap-3 max-w-7xl mx-auto">
        {
          modul.map((e, index) => (
            <Link href={`/modul/${e.modulid}`} className="" key={e.modulid ?? index}>
              <button className=" cursor-pointer w-full h-[40px] middle none center px-2 rounded-lg border border-blue-500 font-sans text-xs font-bold uppercase text-blue-500 transition-all hover:opacity-75 focus:ring focus:ring-blue-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none truncate">
                {e.modulname}
              </button>
            </Link>
          ))
        }
      </div>
    </main>
  );
}