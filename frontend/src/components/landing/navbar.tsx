'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="fixed w-full z-50 top-0 transition-all duration-300 glass shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300">
                            <div className="bg-white rounded-xl p-1.5 h-12 w-12 flex items-center justify-center shadow-sm border border-slate-100">
                                <Image
                                    src="/logo-new.png"
                                    alt="Apni Vidya"
                                    width={45}
                                    height={45}
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight transition-colors font-outfit text-blue-700 group-hover:text-blue-600">Apni Vidya</span>
                        </Link>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center">
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-600 text-white px-7 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-blue-200 shadow-lg active:scale-95 hover:shadow-blue-300 translate-y-0 hover:-translate-y-0.5"
                        >
                            Login
                        </button>
                    </div>

                </div>
            </div>

        </nav>
    );
}
