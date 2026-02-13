'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from 'next/navigation';

export default function Hero() {
    const router = useRouter();

    return (
        <div id="home" className="relative bg-gradient-to-br from-slate-50 via-blue-50/50 to-white pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden font-outfit">
            {/* Background decoration - simplified */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[30rem] h-[30rem] bg-blue-200/20 rounded-full blur-[80px] opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[25rem] h-[25rem] bg-indigo-200/20 rounded-full blur-[80px] opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content */}
                    <div className="lg:w-1/2 text-center lg:text-left z-10 order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-blue-100 text-blue-700 font-bold text-sm mb-8 animate-fade-in-up hover:bg-white transition-all shadow-sm hover:shadow-md cursor-default backdrop-blur-sm">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            Admissions Open 2026
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                            Master Skills with <br className="hidden lg:block" />
                            <span className="relative inline-block mt-2 lg:mt-0">
                                <span className="absolute inset-0 bg-blue-600 transform -skew-x-6 rounded-lg shadow-lg shadow-blue-200 z-0"></span>
                                <span className="relative text-white px-4 z-10">IITian Guides</span>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Apni Vidya offers live, interactive classes for students. Learn real-world skills directly from the experts, not just recorded videos.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => router.push('/login')}
                                className="group w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 border border-blue-500"
                            >
                                Login to Start
                                <span className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="h-5 w-5" />
                                </span>
                            </button>
                        </div>

                        <div className="mt-14 flex items-center justify-center lg:justify-start gap-8 sm:gap-12">
                            {[
                                { val: "10k+", label: "Students" },
                                { val: "50+", label: "Mentors" },
                                { val: "4.9/5", label: "Rating" }
                            ].map((stat, idx) => (
                                <div key={idx} className="flex flex-col items-center lg:items-start group cursor-pointer">
                                    <span className="font-extrabold text-3xl text-slate-900 group-hover:text-blue-600 transition-colors drop-shadow-sm">{stat.val}</span>
                                    <span className="text-sm text-slate-500 font-semibold">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Animation */}
                    <div className="lg:w-1/2 w-full max-w-lg lg:max-w-none order-1 lg:order-2">
                        <div className="relative transform hover:scale-[1.01] transition-transform duration-500">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-[2.6rem] blur-2xl opacity-20 animate-pulse"></div>
                            <div className="relative bg-white/40 backdrop-blur-lg border border-white/60 rounded-[2.5rem] p-6 shadow-2xl backdrop-saturate-150 ring-1 ring-white/50">
                                <DotLottieReact
                                    src="https://lottie.host/a8cb6da2-0d1f-43bd-aa91-b2f56f7a311f/lFIvlqHSZE.lottie"
                                    loop
                                    autoplay
                                    className="w-[90%] mx-auto h-auto drop-shadow-lg"
                                />
                                {/* Floating Badge */}
                                <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-4 pr-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow shadow-blue-900/5 ring-1 ring-slate-50">
                                    <div className="bg-orange-100 p-3.5 rounded-xl shadow-inner">
                                        <Sparkles className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Top Rated</p>
                                        <p className="text-slate-900 font-extrabold text-base">#1 Skill Platform</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-bounce-slow {
                    animation: bounce 3s infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }
            `}</style>
        </div >
    );
}
