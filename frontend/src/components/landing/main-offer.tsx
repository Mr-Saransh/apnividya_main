'use client';

import { Check, Target, Zap, Sparkles, Trophy, Clock, Users } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from 'next/navigation';

export default function MainOffer() {
    const router = useRouter();

    const features = [
        "Personality Development",
        "Computer Skills with AI",
        "Coding & Programming",
        "Cyber Security Basics",
        "Financial Literacy",
        "Live Doubt Solving"
    ];

    const posterBenefits = [
        "Certification on Completion",
        "Live Classes",
        "Learn from IIT Guides",
        "Practical & Industry-Focused Learning"
    ];

    return (
        <section id="courses" className="py-20 bg-[#e0efff] font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-2 animate-bounce-slow">
                        <Target className="w-8 h-8 text-blue-600" />
                        <h2 className="text-xl md:text-3xl font-bold text-blue-900 tracking-tight">New Year. New Course. New Opportunity.</h2>
                    </div>
                </div>

                {/* Poster Card Container */}
                <div className="max-w-[500px] mx-auto relative perspective-1000 group/poster">

                    {/* Sparkling/Glow Effect Container - Simplified */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300/30 via-yellow-100/30 to-yellow-300/30 rounded-[2.6rem] blur opacity-70"></div>
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-400/20 via-white/20 to-blue-400/20 rounded-[2.6rem] opacity-30"></div>

                    {/* Top Ribbon - STARTING OF THE YEAR SALE */}
                    <div className="relative z-30 mx-auto w-full max-w-[95%] -mb-7">
                        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white text-center py-4 px-2 rounded-sm shadow-xl relative transform transition-transform hover:scale-105 duration-300 ring-1 ring-white/30">
                            {/* Ribbon Folds */}
                            <div className="absolute top-0 left-0 -ml-4 mt-2 border-r-[16px] border-r-blue-900 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent -z-10 rotate-45 transform origin-top-right"></div>
                            <div className="absolute top-0 right-0 -mr-4 mt-2 border-l-[16px] border-l-blue-900 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent -z-10 -rotate-45 transform origin-top-left"></div>

                            {/* Ribbon Tails visible on sides */}
                            <div className="absolute top-2 -left-6 h-12 w-10 bg-gradient-to-b from-blue-700 to-blue-800 skew-y-12 rounded-l-sm -z-20 shadow-lg border-l border-white/20"></div>
                            <div className="absolute top-2 -right-6 h-12 w-10 bg-gradient-to-b from-blue-700 to-blue-800 -skew-y-12 rounded-r-sm -z-20 shadow-lg border-r border-white/20"></div>

                            <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-widest drop-shadow-md leading-tight">
                                <span className="block text-sm md:text-base text-blue-100 font-bold mb-1 tracking-[0.2em] flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                                    Starting of the Year
                                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                                </span>
                                Offer
                            </h3>

                            {/* Confetti specs on ribbon */}
                            <div className="absolute top-2 left-4 w-1 h-1 bg-yellow-300 rounded-full opacity-70 animate-ping"></div>
                            <div className="absolute bottom-3 right-6 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-60 animate-ping delay-300"></div>
                        </div>
                    </div>

                    {/* Main Blue Card Body */}
                    <div className="bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 rounded-[2.5rem] p-1 shadow-2xl relative z-20 pt-10 pb-4 ring-1 ring-white/50 backdrop-blur-sm">
                        <div className="bg-gradient-to-b from-[#2563eb] via-[#3b82f6] to-[#60a5fa] rounded-[2.2rem] border-t border-white/40 overflow-hidden relative shadow-inner">

                            {/* Background Effects */}
                            <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
                                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1.5px)', backgroundSize: '15px 15px' }}>
                            </div>

                            {/* Light rays */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-white/30 to-transparent blur-3xl rounded-full pointer-events-none animate-pulse-slow"></div>

                            {/* Offer Section */}
                            <div className="text-center pt-8 pb-10 relative">
                                <p className="text-white font-bold text-xl tracking-[0.3em] mb-[-10px] drop-shadow-sm uppercase flex justify-center items-center gap-3">
                                    <span className="h-[1px] w-8 bg-white/50"></span>
                                    Skill
                                    <span className="h-[1px] w-8 bg-white/50"></span>
                                </p>
                                <div className="relative inline-block transform hover:scale-105 transition-transform duration-500 ease-out">
                                    <h2 className="text-[5.5rem] md:text-[7rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-50 to-blue-200 drop-shadow-[0_10px_0px_rgba(30,58,138,0.3)] filter" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>
                                        Mastery
                                    </h2>
                                    <span className="absolute bottom-6 -right-4 text-white font-black text-2xl md:text-3xl drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] rotate-[-12deg] tracking-wider bg-red-500 px-2 py-0.5 rounded-lg transform hover:rotate-0 transition-all duration-300">HUB</span>

                                    {/* Star burst behind text */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/20 blur-3xl -z-10 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* Middle Ribbon */}
                            <div className="relative w-[108%] -left-[4%] mb-6 group">
                                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white text-center py-2.5 shadow-lg relative z-20 flex justify-center items-center shadow-blue-900/50 border-y border-white/10">
                                    <div className="absolute inset-0 bg-blue-600/20 animate-pulse"></div>
                                    <p className="flex items-center justify-center gap-2 font-bold text-sm md:text-base italic tracking-wide relative z-10">
                                        <Trophy className="w-5 h-5 text-yellow-400" />
                                        Become an <span className="text-yellow-300 font-extrabold underline decoration-yellow-300/50 underline-offset-4 decoration-wavy">Industry Ready Professional</span>
                                    </p>
                                </div>
                                {/* Ribbon depth corners */}
                                <div className="absolute top-full left-3 border-t-[12px] border-t-blue-950 border-l-[12px] border-l-transparent w-0 h-0"></div>
                                <div className="absolute top-full right-3 border-t-[12px] border-t-blue-950 border-r-[12px] border-r-transparent w-0 h-0"></div>
                            </div>

                            {/* Content Area - White/Light Blue Gradient */}
                            <div className="bg-gradient-to-b from-white to-blue-50 mx-4 mb-4 rounded-xl p-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-slate-800 relative z-10 border border-white">
                                {/* Benefits Checkmarks */}
                                <div className="space-y-2.5 mb-5 pl-2">
                                    {posterBenefits.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3 group/item">
                                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-full p-1 mt-0.5 shrink-0 shadow-sm group-hover/item:scale-110 transition-transform">
                                                <Check className="w-3 h-3 text-white stroke-[4]" />
                                            </div>
                                            <span className="font-bold text-slate-700 text-sm md:text-[15px] leading-tight pt-0.5 group-hover/item:text-blue-700 transition-colors">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent w-full mb-5"></div>

                                {/* Included Modules */}
                                <h4 className="text-center text-blue-800 font-bold mb-4 uppercase text-xs tracking-widest opacity-80 flex items-center justify-center gap-2">
                                    <span className="w-4 h-[1px] bg-blue-300"></span>
                                    Core Modules
                                    <span className="w-4 h-[1px] bg-blue-300"></span>
                                </h4>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {features.map((feature, i) => (
                                        <div key={i} className="flex flex-col items-center text-center p-2.5 bg-white rounded-lg border border-blue-50 shadow-sm hover:shadow-md transition-all hover:border-blue-200 hover:-translate-y-0.5">
                                            <div className="h-4 w-4 mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                            </div>
                                            <span className="text-[10px] md:text-[11px] font-bold text-slate-600 leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Enroll Button Container */}
                            <div className="px-5 pb-8 relative z-20">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full group relative overflow-hidden bg-white hover:bg-blue-50 text-blue-700 rounded-full p-1.5 shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(37,99,235,0.5)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white opacity-50"></div>
                                    <div className="bg-gradient-to-b from-white to-blue-50 rounded-full py-3 px-4 flex flex-col items-center justify-center border-2 border-blue-200 relative z-10 group-hover:border-blue-300 transition-colors">
                                        <span className="text-xl md:text-2xl font-black uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-blue-800 to-blue-600 drop-shadow-sm flex items-center gap-2">
                                            Get Started <Users className="w-5 h-5 text-blue-600" />
                                        </span>
                                        <span className="text-[10px] md:text-xs font-bold text-blue-500 tracking-[0.15em] uppercase">
                                            Login to access all the courses
                                        </span>
                                    </div>
                                    {/* Shine effect */}
                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[30deg] animate-shine"></div>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shine {
                    0% { left: -100%; }
                    20% { left: 100%; }
                    100% { left: 100%; }
                }
                .animate-shine {
                    animation: shine 3s infinite;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .animate-tilt {
                    animation: tilt 10s infinite linear;
                }
                @keyframes tilt {
                    0%, 50%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(0.5deg); }
                    75% { transform: rotate(-0.5deg); }
                }
                .animate-pulse-slow {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
                .animate-bounce-slow {
                    animation: bounce 3s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }
            `}</style>
        </section>
    );
}
