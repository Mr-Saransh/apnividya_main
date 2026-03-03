'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import {
    Bot, MessageCircle, FileText, BarChart2, Palette, Mic, MicOff,
    Send, ChevronLeft, Bell, ChevronDown, AlertCircle, ChevronRight,
    Home, Menu,
} from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/* ─── Types ─────────────────────────────────────────────── */
type Subject = 'Maths' | 'Science' | 'English' | 'History' | 'Coding';
type Section = 'ai-tutor' | 'doubt-solver' | 'mock-tests' | 'performance' | 'visual' | 'spoken';

/* ─── Data ───────────────────────────────────────────────── */
const subjectGreetings: Record<Subject, string> = {
    Maths: "Hello! What topic shall we explore in Maths today?",
    Science: "Hi! Ready to explore Science? Ask me anything!",
    English: "Let's work on your English skills. What do you need help with?",
    History: "Let's journey through History. What period are you studying?",
    Coding: "Hello, coder! What programming concept can I help you with?",
};
const subjectReplies: Record<Subject, string[]> = {
    Maths: ["Sure! Algebra is about finding the unknown or putting real-life variables into equations. Shall we start with a simple example?", "Great question! Let me break that step by step...", "In Maths, this works by first identifying what you know vs what to find."],
    Science: ["Fascinating! This is one of the key discoveries in modern Science...", "Let me explain with a real-world example that'll click!", "Scientists first discovered this when they observed..."],
    English: ["Great! Let me help you understand the grammar rule here...", "In English, the key is understanding context and sentence structure.", "Let's look at some examples to make this clear."],
    History: ["Let's travel back to that era... The key events were...", "This is a pivotal moment. Here's what happened and why it matters...", "The key figures involved were..."],
    Coding: ["Perfect! Here's how that works in code... let me show you step by step.", "Great question! This concept is used to make programs more efficient.", "Let's debug this together! The issue is likely in your logic flow."],
};
const doubtReplies = [
    "Great doubt! Let me clarify this for you...",
    "Many students have the same question. Here's the answer:",
    "Good catch! The concept here is:",
    "That's a common misconception. Here's what actually happens:",
];
const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: 'ai-tutor', label: 'AI Tutor', icon: Bot },
    { id: 'doubt-solver', label: 'Doubt Solver', icon: MessageCircle },
    { id: 'mock-tests', label: 'Mock Tests', icon: FileText },
    { id: 'performance', label: 'Performance Tracker', icon: BarChart2 },
    { id: 'visual', label: 'Visual Learning', icon: Palette },
    { id: 'spoken', label: 'Spoken English', icon: Mic },
];

interface Msg { role: 'bot' | 'user'; text: string; }
interface Stats { dayStreak: number; karmaPoints: number; lessonsCompleted: number; globalRank: number; }

/* ─── Helpers ────────────────────────────────────────────── */
const randFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

/* ─── Component ──────────────────────────────────────────── */
export default function AcademicPortalPage() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState<Section>('ai-tutor');
    const [activeSubject, setActiveSubject] = useState<Subject>('Maths');
    const [tutorMsgs, setTutorMsgs] = useState<Msg[]>([{ role: 'bot', text: subjectGreetings['Maths'] }]);
    const [tutorInput, setTutorInput] = useState('');
    const [tutorTyping, setTutorTyping] = useState(false);
    const [tutorLevel, setTutorLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
    const [doubtMsgs, setDoubtMsgs] = useState<Msg[]>([{ role: 'bot', text: "Hello! Ask me any doubt from any subject. I'll answer instantly 24/7." }]);
    const [doubtInput, setDoubtInput] = useState('');
    const [doubtTyping, setDoubtTyping] = useState(false);
    const [stats, setStats] = useState<Stats | null>(null);
    const [testClass, setTestClass] = useState('Class 10');
    const [testSubject, setTestSubject] = useState('Maths');
    const [testTopic, setTestTopic] = useState('Algebra');
    const [testQCount, setTestQCount] = useState('10 Questions');
    const [isListening, setIsListening] = useState(false);
    const [micScore, setMicScore] = useState<number | null>(null);
    const tutorRef = useRef<HTMLDivElement>(null);
    const doubtRef = useRef<HTMLDivElement>(null);

    useEffect(() => { api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => { }); }, []);
    useEffect(() => { setTutorMsgs([{ role: 'bot', text: subjectGreetings[activeSubject] }]); }, [activeSubject]);
    useEffect(() => { tutorRef.current?.scrollTo({ top: tutorRef.current.scrollHeight, behavior: 'smooth' }); }, [tutorMsgs, tutorTyping]);
    useEffect(() => { doubtRef.current?.scrollTo({ top: doubtRef.current.scrollHeight, behavior: 'smooth' }); }, [doubtMsgs, doubtTyping]);

    const sendTutor = () => {
        if (!tutorInput.trim()) return;
        const msg = tutorInput.trim(); setTutorInput('');
        setTutorMsgs(p => [...p, { role: 'user', text: msg }]);
        setTutorTyping(true);
        setTimeout(() => { setTutorTyping(false); setTutorMsgs(p => [...p, { role: 'bot', text: randFrom(subjectReplies[activeSubject]) }]); }, 1000 + Math.random() * 800);
    };
    const sendDoubt = () => {
        if (!doubtInput.trim()) return;
        const msg = doubtInput.trim(); setDoubtInput('');
        setDoubtMsgs(p => [...p, { role: 'user', text: msg }]);
        setDoubtTyping(true);
        setTimeout(() => { setDoubtTyping(false); setDoubtMsgs(p => [...p, { role: 'bot', text: randFrom(doubtReplies) }]); }, 900 + Math.random() * 600);
    };
    const handleMic = () => {
        if (isListening) { setIsListening(false); setTimeout(() => setMicScore(Math.floor(Math.random() * 18) + 78), 400); }
        else { setIsListening(true); setMicScore(null); }
    };

    const firstName = user?.fullName?.split(' ')[0] || 'Student';
    const initials = (user?.fullName || 'S').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    const streak = stats?.dayStreak ?? 0;
    const karma = stats?.karmaPoints ?? 0;
    const overallScore = Math.min(99, 60 + Math.floor(karma / 20));
    const weakTopics = Math.max(1, 3 - Math.floor(karma / 200));
    const chartData = [
        { month: 'Jan', score: Math.max(50, 58 + Math.floor(karma / 60)) },
        { month: 'Feb', score: Math.max(55, 62 + Math.floor(karma / 55)) },
        { month: 'Mar', score: Math.max(60, 66 + Math.floor(karma / 50)) },
        { month: 'Apr', score: Math.max(62, 70 + Math.floor(karma / 45)) },
        { month: 'May', score: Math.max(65, 74 + Math.floor(karma / 40)) },
        { month: 'Jun', score: Math.min(99, 78 + Math.floor(karma / 35)) },
    ];
    const subjects: Subject[] = ['Maths', 'Science', 'English', 'History', 'Coding'];
    const visualCards = [
        { title: 'Pythagoras Theorem', gradient: 'from-orange-400 via-pink-500 to-purple-500' },
        { title: 'Trigonometry', gradient: 'from-teal-400 to-blue-500' },
        { title: 'Cell Division', gradient: 'from-green-400 to-cyan-500' },
        { title: "Newton's Laws", gradient: 'from-yellow-400 to-orange-500' },
    ];

    /* ── Shared class helpers ── */
    const card = "rounded-2xl border border-border bg-card shadow-sm";
    const inputCls = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors";
    const selectCls = "w-full bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2.5 outline-none appearance-none transition-colors";

    /* ── Chat bubbles ── */
    const ChatMessages = ({ msgs, isTyping, chatRef }: { msgs: Msg[], isTyping: boolean, chatRef: React.RefObject<HTMLDivElement> }) => (
        <div ref={chatRef} className="flex-1 px-5 py-4 overflow-y-auto flex flex-col gap-4" style={{ maxHeight: 320 }}>
            {msgs.map((m, i) => (
                <div key={i} className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                    {m.role === 'bot' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0">AI</div>}
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed border shadow-sm ${m.role === 'user' ? 'bg-primary border-primary/30 text-primary-foreground' : 'bg-muted border-border text-foreground'}`}>{m.text}</div>
                </div>
            ))}
            {isTyping && (
                <div className="flex gap-3 self-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0">AI</div>
                    <div className="bg-muted border border-border px-4 py-3 rounded-2xl flex gap-1 items-center">
                        {[0, 150, 300].map(d => <span key={d} className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                    </div>
                </div>
            )}
        </div>
    );

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo Area */}
            <div className="h-14 flex items-center gap-2 px-5 border-b border-border shrink-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-xs">AV</span>
                </div>
                <span className="text-foreground font-bold text-sm">Academic AI</span>
            </div>

            {/* Back to Home */}
            <button onClick={() => window.location.href = '/dashboard/academic'}
                className="flex items-center gap-2 mx-3 mt-4 mb-2 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-sm font-medium shrink-0">
                <ChevronLeft className="h-4 w-4" />
                Dashboard
            </button>

            {/* Nav Items */}
            <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto mt-2">
                {NAV_ITEMS.map(item => {
                    const isActive = activeSection === item.id;
                    return (
                        <button key={item.id} onClick={() => setActiveSection(item.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${isActive
                                ? 'bg-primary/10 text-primary border-l-[3px] border-primary rounded-l-none'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}>
                            <item.icon className="h-4 w-4 shrink-0" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* User avatar at bottom */}
            <div className="p-4 border-t border-border flex items-center gap-3 bg-muted/30 shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">{initials}</div>
                <span className="text-foreground text-sm font-medium truncate">{firstName}</span>
                <Bell className="h-4 w-4 text-muted-foreground ml-auto shrink-0" />
            </div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
            {/* ── Left Sidebar (Academic Sub-navigation) ── */}
            <aside className="hidden lg:flex flex-col w-60 bg-card border-r border-border shrink-0">
                <SidebarContent />
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto bg-background/50">
                {/* Top breadcrumb bar */}
                <div className="sticky top-0 z-20 h-14 flex items-center gap-3 px-4 lg:px-6 bg-background/90 backdrop-blur border-b border-border shadow-sm">
                    {/* Hamburger Trigger for Mobile */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger className="p-2 border border-border rounded-lg bg-card text-foreground hover:bg-muted/50 transition-colors">
                                <Menu className="h-4 w-4" />
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 bg-card p-0 border-r border-border">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center gap-2 text-sm z-20">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">/</span>
                        <span className="text-primary font-medium">Academic Portal</span>
                    </div>
                </div>

                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {/* Mobile Only: Section Navigation */}
                    <div className="lg:hidden mb-6 flex overflow-x-auto gap-2 pb-2 hide-scrollbar border-b border-border">
                        {NAV_ITEMS.map(item => (
                            <button key={item.id} onClick={() => setActiveSection(item.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSection === item.id
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-muted-foreground bg-card border border-border'
                                    }`}>
                                <item.icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Greeting */}
                    <div className="mb-6">
                        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{greeting}, <span className="text-primary">{firstName}</span> 👋</h1>
                        <p className="text-muted-foreground text-sm">Ready to learn today?</p>
                    </div>

                    {/* Subject Tabs */}
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-1 hide-scrollbar">
                        {subjects.map(s => (
                            <button key={s} onClick={() => setActiveSubject(s)}
                                className={`px-5 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all shadow-sm ${activeSubject === s
                                    ? 'bg-primary border-primary text-primary-foreground scale-105'
                                    : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                    }`}>{s}</button>
                        ))}
                    </div>

                    {/* ── Section: AI Tutor ── */}
                    {(activeSection === 'ai-tutor') && (
                        <div className="grid lg:grid-cols-[1fr_380px] gap-6 mb-6">
                            {/* AI Tutor Chat */}
                            <div className={`${card} flex flex-col overflow-hidden`} style={{ minHeight: 480 }}>
                                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-sm">
                                            <Bot className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground text-sm">🤖 AI Tutor</h3>
                                            <p className="text-xs text-primary font-medium">Online • {activeSubject}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <select value={tutorLevel} onChange={e => setTutorLevel(e.target.value as typeof tutorLevel)}
                                            className="bg-background border border-border text-foreground text-xs rounded-lg px-3 py-1.5 pr-8 outline-none appearance-none hover:border-primary/50 transition-colors">
                                            {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                                <ChatMessages msgs={tutorMsgs} isTyping={tutorTyping} chatRef={tutorRef as React.RefObject<HTMLDivElement>} />
                                <div className="px-4 py-4 border-t border-border flex gap-3 bg-card">
                                    <input value={tutorInput} onChange={e => setTutorInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendTutor()}
                                        placeholder={`Ask anything about ${activeSubject}...`} className={`${inputCls} flex-1 rounded-full px-5 py-3 shadow-sm`} />
                                    <button onClick={sendTutor} className="w-12 h-12 rounded-full bg-primary hover:opacity-90 flex items-center justify-center shrink-0 transition-all shadow-md active:scale-95">
                                        <Send className="h-5 w-5 text-primary-foreground ml-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Right: Performance + Mock Test */}
                            <div className="flex flex-col gap-5">
                                {/* Performance */}
                                <div className={card + " p-5"}>
                                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                        <span>📊</span> Performance
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[
                                            { label: 'Overall', value: `${overallScore}%`, cls: 'text-foreground' },
                                            { label: 'Streak', value: streak, suffix: '🔥', cls: 'text-orange-500' },
                                            { label: 'Weak', value: `${weakTopics} Topics`, cls: 'text-destructive', small: true },
                                        ].map((s, i) => (
                                            <div key={i} className="bg-background border border-border rounded-xl p-3 text-center shadow-sm">
                                                <span className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">{s.label}</span>
                                                <strong className={`text-sm font-bold font-mono ${s.cls}`}>
                                                    {s.value}{s.suffix || ''}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                    <ResponsiveContainer width="100%" height={100}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ background: '#0d1829', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                                            <Line type="monotone" dataKey="score" stroke="#3D7EFF" strokeWidth={2} dot={{ fill: '#00D4B8', strokeWidth: 0, r: 3 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    <div className="mt-3 flex items-center gap-2 px-3 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-orange-400">
                                        <AlertCircle className="h-3 w-3 shrink-0" />
                                        Focus on: Algebra, Light &amp; Optics
                                    </div>
                                </div>

                                {/* Mock Test Generator */}
                                <div className={card + " p-5"}>
                                    <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">📋 Mock Test Generator</h3>
                                    <div className="flex flex-col gap-2.5">
                                        {[
                                            { value: testClass, onChange: setTestClass, opts: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'] },
                                            { value: testSubject, onChange: setTestSubject, opts: ['Maths', 'Science', 'English', 'History', 'Coding'] },
                                            { value: testTopic, onChange: setTestTopic, opts: ['Algebra', 'Geometry', 'Trigonometry', 'Statistics'] },
                                            { value: testQCount, onChange: setTestQCount, opts: ['5 Questions', '10 Questions', '15 Questions', '20 Questions'] },
                                        ].map((s, i) => (
                                            <div key={i} className="relative">
                                                <select value={s.value} onChange={e => s.onChange(e.target.value)} className={selectCls}>
                                                    {s.opts.map(o => <option key={o}>{o}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
                                            </div>
                                        ))}
                                        <button className="w-full flex items-center justify-center gap-2 bg-[#3D7EFF] hover:bg-[#2d6bef] text-white font-bold py-2.5 rounded-xl transition-all text-sm mt-1">
                                            Generate Test <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Section: Doubt Solver ── */}
                    {activeSection === 'doubt-solver' && (
                        <div className={`${card} flex flex-col max-w-2xl overflow-hidden`} style={{ minHeight: 480 }}>
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-sm">
                                    <MessageCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-sm">💬 AI Doubt Solver</h3>
                                    <p className="text-xs text-primary font-medium">24/7 instant answers, any subject</p>
                                </div>
                            </div>
                            <ChatMessages msgs={doubtMsgs} isTyping={doubtTyping} chatRef={doubtRef as React.RefObject<HTMLDivElement>} />
                            <div className="px-4 py-4 border-t border-border flex gap-3 bg-card">
                                <input value={doubtInput} onChange={e => setDoubtInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendDoubt()}
                                    placeholder="Type your doubt here (any subject)..." className={`${inputCls} flex-1 rounded-full px-5 py-3 shadow-sm`} />
                                <button onClick={sendDoubt} className="w-12 h-12 rounded-full bg-primary hover:opacity-90 flex items-center justify-center shrink-0 transition-all shadow-md active:scale-95">
                                    <Send className="h-5 w-5 text-primary-foreground ml-1" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Section: Mock Tests ── */}
                    {activeSection === 'mock-tests' && (
                        <div className="grid lg:grid-cols-2 gap-6 max-w-3xl">
                            <div className={card + " p-6"}>
                                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">📋 Mock Test Generator</h3>
                                <p className="text-xs text-muted-foreground mb-4">Auto-tests by class &amp; topic</p>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { label: 'Class', value: testClass, onChange: setTestClass, opts: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'] },
                                        { label: 'Subject', value: testSubject, onChange: setTestSubject, opts: ['Maths', 'Science', 'English', 'History', 'Coding'] },
                                        { label: 'Topic', value: testTopic, onChange: setTestTopic, opts: ['Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Calculus'] },
                                        { label: 'Questions', value: testQCount, onChange: setTestQCount, opts: ['5 Questions', '10 Questions', '15 Questions', '20 Questions'] },
                                    ].map((s, i) => (
                                        <div key={i}>
                                            <label className="text-xs text-muted-foreground block mb-1.5">{s.label}</label>
                                            <div className="relative">
                                                <select value={s.value} onChange={e => s.onChange(e.target.value)} className={selectCls}>
                                                    {s.opts.map(o => <option key={o}>{o}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                                            </div>
                                        </div>
                                    ))}
                                    <button className="mt-2 w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-all shadow-sm">
                                        Generate Test <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className={card + " p-6"}>
                                <h3 className="font-bold text-foreground mb-4">📈 Recent Tests</h3>
                                {[
                                    { subject: 'Maths', topic: 'Algebra', score: 80, total: 10, date: '2 days ago' },
                                    { subject: 'Science', topic: 'Light & Optics', score: 70, total: 10, date: '5 days ago' },
                                    { subject: 'English', topic: 'Grammar', score: 90, total: 10, date: '1 week ago' },
                                ].map((t, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-none">
                                        <div>
                                            <p className="text-foreground text-sm font-medium">{t.subject} — {t.topic}</p>
                                            <p className="text-muted-foreground text-xs">{t.date}</p>
                                        </div>
                                        <span className={`text-sm font-bold font-mono ${t.score >= 80 ? 'text-primary' : t.score >= 60 ? 'text-orange-500' : 'text-destructive'}`}>
                                            {t.score}/{t.total * 10}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Section: Performance Tracker ── */}
                    {activeSection === 'performance' && (
                        <div className="space-y-6 max-w-3xl">
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Overall Score', value: `${overallScore}%`, cls: 'text-foreground', icon: '🎯' },
                                    { label: 'Day Streak', value: `${streak} 🔥`, cls: 'text-orange-500', icon: '🔥' },
                                    { label: 'Weak Topics', value: `${weakTopics}`, cls: 'text-destructive', icon: '⚠️' },
                                ].map((s, i) => (
                                    <div key={i} className={`${card} p-5 text-center`}>
                                        <span className="block text-2xl mb-2">{s.icon}</span>
                                        <strong className={`text-2xl font-bold font-mono ${s.cls} block mb-1`}>{s.value}</strong>
                                        <span className="text-xs text-muted-foreground">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={card + " p-5"}>
                                <h3 className="font-bold text-foreground mb-4">📈 Score Progression</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
                                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)' }} />
                                        <Line type="monotone" dataKey="score" stroke="currentColor" className="text-primary" strokeWidth={2.5} dot={{ fill: 'currentColor', strokeWidth: 0, r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={card + " p-5"}>
                                <h3 className="font-bold text-foreground mb-4">📚 Subject Breakdown</h3>
                                {[
                                    { subject: 'Maths', score: Math.min(99, 60 + Math.floor(karma / 30)) },
                                    { subject: 'Science', score: Math.min(99, 65 + Math.floor(karma / 28)) },
                                    { subject: 'English', score: Math.min(99, 55 + Math.floor(karma / 32)) },
                                    { subject: 'History', score: Math.min(99, 62 + Math.floor(karma / 35)) },
                                    { subject: 'Coding', score: Math.min(99, 70 + Math.floor(karma / 25)) },
                                ].map((s, i) => (
                                    <div key={i} className="mb-3">
                                        <div className="flex justify-between text-xs mb-1.5"><span className="text-foreground">{s.subject}</span><span className="text-muted-foreground">{s.score}%</span></div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: `${s.score}%` }} />
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-500 flex items-center gap-2">
                                    <AlertCircle className="h-3 w-3 shrink-0" /> Focus on: Algebra, Light &amp; Optics
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Section: Visual Learning ── */}
                    {activeSection === 'visual' && (
                        <div className="max-w-2xl">
                            <div className={card + " p-5"}>
                                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">🎨 Visual Learning</h3>
                                <p className="text-xs text-muted-foreground mb-4">Interactive diagrams and animations.</p>
                                <input placeholder="Search concept to visualize..." className={`${inputCls} mb-5`} />
                                <div className="grid grid-cols-2 gap-4">
                                    {visualCards.map((c, i) => (
                                        <div key={i} className="border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group bg-background">
                                            <div className={`h-28 bg-gradient-to-br ${c.gradient}`} />
                                            <p className="text-xs text-center py-3 px-2 text-muted-foreground group-hover:text-foreground transition-colors font-medium">{c.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Section: Spoken English ── */}
                    {activeSection === 'spoken' && (
                        <div className="max-w-lg">
                            <div className={card + " p-6"}>
                                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">🎙️ Spoken English Trainer</h3>
                                <p className="text-xs text-muted-foreground mb-8">Perfect your pronunciation directly via AI.</p>
                                <div className="flex flex-col items-center gap-5 mb-6">
                                    <button onClick={handleMic}
                                        className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl transition-all border-4 ${isListening
                                            ? 'bg-red-500 border-red-400/50 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                                            : 'bg-gradient-to-br from-primary to-purple-500 border-primary/40 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105'
                                            }`}>
                                        {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                                    </button>
                                    <p className="text-sm text-muted-foreground">{isListening ? '🔴 Listening... Tap to stop' : 'Tap to speak'}</p>
                                </div>
                                {micScore !== null ? (
                                    <div className="bg-background border border-border rounded-xl p-4 relative shadow-sm">
                                        <span className="absolute -top-3.5 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">Score: {micScore}/100</span>
                                        <p className="text-sm text-foreground mt-1">"I am going to school"</p>
                                        <p className="text-xs text-primary mt-2 italic">
                                            {micScore >= 85 ? 'Tip: Great pronunciation! Your pitch was natural.' : micScore >= 70 ? 'Tip: Good effort! Work on intonation.' : 'Tip: Keep practicing! Focus on clear vowel sounds.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-background border border-border rounded-xl p-4 text-sm text-muted-foreground text-center shadow-sm">
                                        {isListening ? 'Processing your speech...' : 'Speak a sentence to get AI feedback on your pronunciation.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
