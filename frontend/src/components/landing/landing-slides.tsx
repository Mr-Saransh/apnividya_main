'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const features = [
    {
        emoji: '🏆',
        bg: 'from-amber-400/20 to-yellow-300/10',
        emojiSize: 'text-7xl',
        title: 'Learn. Earn. Level Up.',
        desc: 'Complete daily quests to earn XP, collect rare badges, and climb the global leaderboard with your friends.',
    },
    {
        emoji: '🤖',
        bg: 'from-blue-400/20 to-cyan-300/10',
        emojiSize: 'text-7xl',
        title: 'AI-Powered Tutoring.',
        desc: 'Get instant help on any subject with our AI Tutor. Ask questions, get step-by-step explanations, anytime.',
    },
    {
        emoji: '📡',
        bg: 'from-teal-400/20 to-green-300/10',
        emojiSize: 'text-7xl',
        title: '100% Live Classes.',
        desc: 'No boring recorded videos. Every class is taught live by IITian mentors — interactive, real, and effective.',
    },
    {
        emoji: '🥇',
        bg: 'from-purple-400/20 to-pink-300/10',
        emojiSize: 'text-7xl',
        title: 'Compete & Win.',
        desc: 'Enter national competitions, showcase your skills, and build a portfolio that gets you scholarships and recognition.',
    },
];

export default function FeatureSlider() {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % features.length);
        }, 3500);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const goTo = (i: number) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setCurrent(i);
        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % features.length);
        }, 3500);
    };

    const f = features[current];

    return (
        <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xl p-8 flex flex-col items-center gap-6 backdrop-blur-sm min-h-[380px]">
            {/* Feature Icon */}
            <div
                className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${f.bg} flex items-center justify-center transition-all duration-500`}
                key={current + '-icon'}
            >
                <span className={`${f.emojiSize} select-none drop-shadow-md animate-bounce`} style={{ animationDuration: '2s' }}>
                    {f.emoji}
                </span>
            </div>

            {/* Text */}
            <div className="text-center space-y-2 flex-1" key={current + '-text'}>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {f.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                    {f.desc}
                </p>
            </div>

            {/* Dots */}
            <div className="flex gap-2">
                {features.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${i === current
                                ? 'w-6 h-2.5 bg-blue-600'
                                : 'w-2.5 h-2.5 bg-slate-300 dark:bg-white/20 hover:bg-blue-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
