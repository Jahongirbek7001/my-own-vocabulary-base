"use client"

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    // State to control the visibility of the menu
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className="p-3 bg-white rounded-b-2xl shadow-xl">
                <div className="w-[90%] mx-auto flex justify-between items-center">
                    <Link href={'/'} className=" text-2xl lg:text-3xl">Xan</Link>
                    {/* Menu for large screens */}
                    <ul className="nav-links flex items-center gap-5 text-base">
                        <li><Link href={'/'}>Home</Link></li>
                        <li><Link href={"/irregular-verbs"}>Irregular Verbs</Link></li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
