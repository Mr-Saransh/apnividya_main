'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <nav className="fixed w-full z-50 top-0 transition-all duration-300 glass shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
                            <Image
                                src="/logo-new.png"
                                alt="Apni Vidya"
                                width={50}
                                height={50}
                                className="h-10 w-auto object-contain"
                            />
                            <span className="font-extrabold text-2xl tracking-tight transition-colors font-outfit text-blue-700 group-hover:text-blue-600">Apni Vidya</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {['Home', 'Courses', 'About'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                                className="text-slate-600 hover:text-blue-600 font-bold transition-all hover:-translate-y-0.5 relative group text-sm uppercase tracking-wide"
                            >
                                {item === 'About' ? 'Why Us?' : item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full duration-300"></span>
                            </Link>
                        ))}
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-600 text-white px-7 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-blue-200 shadow-lg active:scale-95 hover:shadow-blue-300 translate-y-0 hover:-translate-y-0.5"
                        >
                            Login
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-blue-600 p-2 transition-colors active:scale-90"
                        >
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute w-full left-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'}`}>
                <div className="px-5 pt-4 pb-8 space-y-4 shadow-xl">
                    {['Home', 'Courses', 'About'].map((item) => (
                        <Link
                            key={item}
                            href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 text-slate-600 hover:text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg"
                        >
                            {item === 'About' ? 'Why Us?' : item}
                        </Link>
                    ))}
                    <div className="pt-2">
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg text-lg flex justify-center items-center gap-2"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
