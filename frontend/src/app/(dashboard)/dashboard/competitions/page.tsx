'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Trophy, X, Home, Calendar, Target, Flag, Medal, Menu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardStats { karmaPoints: number; globalRank: number; dayStreak: number; }

const quizQuestions = [
    { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"], answer: 1 },
    { question: "What is 2² + 3²?", options: ["10", "12", "13", "15"], answer: 2 },
    { question: "Who invented the telephone?", options: ["Edison", "Tesla", "Bell", "Marconi"], answer: 2 },
];

export default function CompetitionsPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [countdown, setCountdown] = useState({ h: 4, m: 12, s: 30 });
    const [quizOpen, setQuizOpen] = useState(false);
    const [quizQ, setQuizQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [quizDone, setQuizDone] = useState(false);
    const [perQTime, setPerQTime] = useState(45);
    const [tab, setTab] = useState<'dashboard' | 'active' | 'upcoming' | 'results' | 'leaderboard' | 'trophies'>('dashboard');

    useEffect(() => { api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => { }); }, []);

    useEffect(() => {
        const t = setInterval(() => {
            setCountdown(prev => {
                let { h, m, s } = prev;
                if (s > 0) return { h, m, s: s - 1 };
                if (m > 0) return { h, m: m - 1, s: 59 };
                if (h > 0) return { h: h - 1, m: 59, s: 59 };
                clearInterval(t); return { h: 0, m: 0, s: 0 };
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const handleNext = useCallback(() => {
        if (selected === quizQuestions[quizQ].answer) setScore(s => s + 1);
        setSelected(null);
        if (quizQ + 1 < quizQuestions.length) setQuizQ(q => q + 1);
        else setQuizDone(true);
    }, [selected, quizQ]);

    useEffect(() => {
        if (!quizOpen || quizDone) return;
        setPerQTime(45);
        const t = setInterval(() => {
            setPerQTime(prev => { if (prev <= 1) { clearInterval(t); handleNext(); return 0; } return prev - 1; });
        }, 1000);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizQ, quizOpen, quizDone]);

    const openQuiz = () => { setQuizOpen(true); setQuizQ(0); setSelected(null); setScore(0); setQuizDone(false); setPerQTime(45); };
    const pad = (n: number) => String(n).padStart(2, '0');
    const firstName = user?.fullName?.split(' ')[0] || 'Student';
    const karma = stats?.karmaPoints ?? 0;
    const globalRank = stats?.globalRank ?? 4700;
    const competitionsEntered = Math.max(1, Math.floor(karma / 50));
    const trophiesWon = Math.max(0, Math.floor(karma / 200));

    const allCompetitions = [
        { emoji: '🧠', tag: 'Quiz', tagColor: '#B47EFF', title: 'Science Weekly Trivia', desc: 'Class 8-10 • Physics & Chem', joined: '1.2k', status: 'active', action: openQuiz, actionLabel: 'Join Now' },
        { emoji: '🗣️', tag: 'Debate', tagColor: '#00D4B8', title: 'Youth Parliament', desc: 'Class 11-12 • Current Affairs', joined: '450', status: 'active', action: () => { }, actionLabel: 'Register' },
        { emoji: '📐', tag: 'Maths', tagColor: '#FF6B35', title: 'Speed Math Challenge', desc: 'Class 6-8 • Arithmetic', joined: '', status: 'upcoming', action: () => { }, actionLabel: 'Notify Me' },
        { emoji: '💻', tag: 'Coding', tagColor: '#3D7EFF', title: 'Hackathon 2024', desc: 'All classes • Open Theme', joined: '890', status: 'upcoming', action: () => { }, actionLabel: 'Register' },
        { emoji: '📖', tag: 'Reading', tagColor: '#f59e0b', title: 'Essay Writing Contest', desc: 'Class 9-12 • English', joined: '320', status: 'results', action: () => { }, actionLabel: 'View Results' },
        { emoji: '🎨', tag: 'Art', tagColor: '#ec4899', title: 'Digital Art Fest', desc: 'All classes • Creative', joined: '600', status: 'results', action: () => { }, actionLabel: 'View Results' },
    ];

    const filtered = tab === 'dashboard' ? allCompetitions : allCompetitions.filter(c => c.status === tab);

    const sidebarLinks = [
        { label: "Dashboard", tab: "dashboard" as const, icon: Home },
        { label: "Upcoming", tab: "upcoming" as const, icon: Calendar },
        { label: "Active Now", tab: "active" as const, icon: Target },
        { label: "My Results", tab: "results" as const, icon: Flag },
        { label: "Leaderboard", tab: "leaderboard" as const, icon: Medal },
        { label: "My Trophies", tab: "trophies" as const, icon: Trophy },
    ];

    const SidebarContent = () => (
        <div className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-muted mb-4 transition-all">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>
            {sidebarLinks.map((link, i) => {
                const active = tab === link.tab;
                return (
                    <button
                        key={i}
                        onClick={() => setTab(link.tab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${active ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                    >
                        <link.icon className={`h-4 w-4 ${active ? 'text-primary-foreground' : ''}`} />
                        {link.label}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 bg-card border-r border-border p-6 sticky top-0 h-screen overflow-y-auto shrink-0">
                    <SidebarContent />
                </aside>

                {/* Main */}
                <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
                    {/* Mobile Hamburger */}
                    <div className="lg:hidden mb-4 flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger className="p-2 border border-border rounded-lg bg-card text-foreground hover:bg-muted/50 transition-colors">
                                <Menu className="h-5 w-5" />
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 bg-card p-6 border-r border-border">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-xl font-bold">Competitions</h1>
                    </div>

                    {/* Header */}
                    <div className="mb-8 hidden lg:block">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-1">Competitions Dashboard</h1>
                        <p className="text-muted-foreground">Compete, win, and level up — <span className="text-primary">{firstName}</span></p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Competitions', value: `${competitionsEntered} Entered`, cls: 'border-l-amber-500' },
                            { label: 'Trophies', value: `${trophiesWon} Won 🏆`, cls: 'border-l-primary' },
                            { label: 'Global Rank', value: `#${globalRank}`, cls: 'border-l-teal-500' },
                        ].map((s, i) => (
                            <div key={i} className={`bg-card border border-border rounded-2xl p-5 text-center border-l-4 ${s.cls}`}>
                                <span className="block text-xs text-muted-foreground mb-1">{s.label}</span>
                                <strong className="text-lg font-bold font-mono text-foreground">{s.value}</strong>
                            </div>
                        ))}
                    </div>

                    {/* Featured Competition */}
                    <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/30 rounded-2xl p-6 mb-8">
                        <div className="flex flex-wrap gap-6 justify-between items-start">
                            <div className="flex-1 min-w-64">
                                <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">⭐ Featured</span>
                                <h2 className="text-2xl font-bold text-foreground mb-2">National Coding Olympiad 2024</h2>
                                <p className="text-muted-foreground max-w-lg text-sm mb-4">
                                    Compete with the best minds. Solve algorithmic challenges and win scholarships up to ₹1 Lakh.
                                </p>
                                <div className="flex gap-5 text-sm text-muted-foreground">
                                    <span>📅 15th October</span><span>⏱️ 2 Hours</span><span>🏆 ₹1 Lakh Pool</span>
                                </div>
                            </div>
                            <div className="bg-muted border border-border rounded-2xl p-5 text-right min-w-48">
                                <p className="text-xs text-muted-foreground mb-1">Registration Closes in</p>
                                <div className="text-2xl font-mono font-bold text-teal-500">{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}</div>
                                <button className="mt-3 w-full bg-primary hover:opacity-90 text-primary-foreground font-bold py-2.5 rounded-xl text-sm transition-all">Register Now</button>
                            </div>
                        </div>
                    </div>



                    {/* Competitions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((c, i) => (
                            <div key={i} className="bg-card border border-border rounded-2xl p-5 flex flex-col hover:border-primary/30 transition-all">
                                <div className="text-3xl mb-3">{c.emoji}</div>
                                <span className="inline-block text-xs font-bold px-2 py-0.5 rounded border mb-2 max-w-max" style={{ color: c.tagColor, borderColor: `${c.tagColor}40`, background: `${c.tagColor}15` }}>{c.tag}</span>
                                <h4 className="text-foreground font-bold text-sm mb-1">{c.title}</h4>
                                <p className="text-xs text-muted-foreground flex-1 mb-4">{c.desc}</p>
                                <div className="flex items-center justify-between border-t border-border pt-4">
                                    <span className="text-xs text-muted-foreground">{c.joined ? `👥 ${c.joined} joined` : c.status === 'upcoming' ? '🗓️ Upcoming' : '🏁 Ended'}</span>
                                    <button onClick={c.action} className="border border-border text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-muted hover:border-primary/40 transition-all">{c.actionLabel}</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quiz Modal */}
                    {quizOpen && (
                        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-2xl">
                                {!quizDone ? (
                                    <>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="font-mono text-teal-500 text-sm">Question {quizQ + 1} of {quizQuestions.length}</span>
                                            <span className="font-mono text-orange-500 text-sm">⏱️ 00:{pad(perQTime)}</span>
                                            <button onClick={() => setQuizOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-8 text-foreground">{quizQuestions[quizQ].question}</h2>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            {quizQuestions[quizQ].options.map((opt, i) => (
                                                <button key={i} onClick={() => setSelected(i)}
                                                    className={`p-5 text-left rounded-xl border font-medium transition-all text-sm ${selected === i ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-muted text-foreground hover:border-primary/40'
                                                        }`}>
                                                    {String.fromCharCode(65 + i)}. {opt}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden mr-6">
                                                <div className="h-full bg-primary rounded-full" style={{ width: `${(quizQ / quizQuestions.length) * 100}%` }} />
                                            </div>
                                            <button onClick={handleNext} disabled={selected === null}
                                                className="bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground font-bold px-6 py-3 rounded-xl transition-all text-sm">
                                                {quizQ + 1 === quizQuestions.length ? 'Finish' : 'Next →'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold mb-2 text-foreground">Quiz Complete!</h2>
                                        <p className="text-muted-foreground mb-2">You scored</p>
                                        <p className="text-5xl font-bold text-teal-500 font-mono mb-6">{score}/{quizQuestions.length}</p>
                                        <p className="text-muted-foreground mb-8">
                                            {score === quizQuestions.length ? '🎉 Perfect score!' : score >= Math.floor(quizQuestions.length / 2) ? '👍 Great job!' : '💪 Keep practising!'}
                                        </p>
                                        <div className="flex gap-4 justify-center">
                                            <button onClick={openQuiz} className="bg-primary hover:opacity-90 text-primary-foreground font-bold px-6 py-3 rounded-xl">Try Again</button>
                                            <button onClick={() => setQuizOpen(false)} className="border border-border text-foreground font-bold px-6 py-3 rounded-xl hover:bg-muted">Close</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
