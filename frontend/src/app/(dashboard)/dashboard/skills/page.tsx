'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { BookOpen, Code, Brain, Users, Star, Award, Play, ExternalLink, FileText, LayoutDashboard, ArrowLeft, Menu } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Enrollment { courseId: string; title: string; thumbnail: string | null; progress: number; }
interface Course { id: string; title: string; description: string; thumbnail: string | null; category: string; }
interface DashboardStats { totalEnrollments: number; lessonsCompleted: number; continueLearning: Enrollment[]; }

const categoryColors: Record<string, string> = {
    coding: '#3D7EFF', ai: '#B47EFF', communication: '#FF6B35', personality: '#00D4B8', default: '#94A3B8',
};
const categoryGradients: Record<string, string> = {
    coding: 'from-[#1a2a44] to-[#2a3f66]',
    ai: 'from-[#1a1a44] to-[#2a2a66]',
    communication: 'from-[#512b58] to-[#864879]',
    personality: 'from-[#0e5e6f] to-[#3a8891]',
    default: 'from-slate-600 to-slate-500',
};

const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/skills', active: true },
    { icon: BookOpen, label: 'My Courses', href: '/dashboard/courses' },
    { icon: FileText, label: 'Mock Test', href: '/dashboard/mock-test' },
    { icon: Users, label: 'Community', href: '/dashboard/community' },
    { icon: Code, label: 'Coding', href: '' },
    { icon: Brain, label: 'AI & ML', href: '' },
    { icon: Star, label: 'Personality Dev', href: '' },
    { icon: Award, label: 'My Certificates', href: '' },
];

const recommendedCourses = [
    { id: 'r1', title: 'Build Your First Chatbot', tag: 'AI & ML', mentor: 'Sarah (Ex-Google)', weeks: '4 Weeks', color: 'from-[#1a2a44] to-[#2a3f66]', dot: '#3D7EFF', live: true },
    { id: 'r2', title: 'Public Speaking Masterclass', tag: 'Communication', mentor: 'Ananya', weeks: 'Self-Paced', color: 'from-[#512b58] to-[#864879]', dot: '#B47EFF', live: false },
    { id: 'r3', title: 'Web Dev with HTML/CSS', tag: 'Coding', mentor: 'Rahul', weeks: '6 Weeks', color: 'from-[#0e5e6f] to-[#3a8891]', dot: '#00D4B8', live: false },
];

export default function SkillsPortalPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, coursesRes] = await Promise.all([api.get('/dashboard/stats'), api.get('/courses')]);
                setStats(statsRes.data);
                const list = Array.isArray(coursesRes.data) ? coursesRes.data : (coursesRes.data?.courses || []);
                setCourses(list.slice(0, 6));
                setCertificates(Math.floor(statsRes.data?.totalEnrollments / 2));
            } catch { /* silent */ } finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const enrolledCount = stats?.totalEnrollments || 0;
    const hoursLearned = Math.max(1, (stats?.lessonsCompleted || 0) * 3);
    const continueLearning = stats?.continueLearning || [];
    const firstName = user?.fullName?.split(' ')[0] || 'Student';

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 bg-card border-r border-border p-6 sticky top-0 h-screen overflow-y-auto shrink-0">
                    <div className="space-y-1">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-muted mb-4 transition-all">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                        {sidebarLinks.map((link, i) => {
                            const cls = `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${link.active ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`;
                            const content = (<><link.icon className={`h-4 w-4 ${link.active ? 'text-primary-foreground' : ''}`} />{link.label}</>);
                            return link.href ? (
                                <Link key={i} href={link.href} className={cls}>{content}</Link>
                            ) : (
                                <div key={i} className={`${cls} cursor-default`}>{content}</div>
                            );
                        })}
                    </div>
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
                                <div className="space-y-1">
                                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-muted mb-4 transition-all">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Home
                                    </Link>
                                    {sidebarLinks.map((link, i) => {
                                        const cls = `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${link.active ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                            }`;
                                        const content = (<><link.icon className={`h-4 w-4 ${link.active ? 'text-primary-foreground' : ''}`} />{link.label}</>);
                                        return link.href ? (
                                            <Link key={i} href={link.href} className={cls}>{content}</Link>
                                        ) : (
                                            <div key={i} className={`${cls} cursor-default`}>{content}</div>
                                        );
                                    })}
                                </div>
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-xl font-bold">Skills</h1>
                    </div>

                    <div className="mb-8 hidden lg:block">
                        <h1 className="text-3xl font-bold mb-1 text-foreground">Skills Dashboard</h1>
                        <p className="text-muted-foreground">Track your progress, <span className="text-primary">{firstName}</span></p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Enrolled', value: `${enrolledCount} Courses`, cls: 'border-l-blue-500' },
                            { label: 'Hours Learned', value: `${hoursLearned} Hours`, cls: 'border-l-teal-500' },
                            { label: 'Certificates', value: `${certificates} Earned`, cls: 'border-l-purple-500' },
                        ].map((s, i) => (
                            <div key={i} className={`bg-card border border-border rounded-2xl p-5 text-center border-l-4 ${s.cls}`}>
                                <span className="block text-xs text-muted-foreground mb-1">{s.label}</span>
                                <strong className="text-lg font-bold font-mono text-foreground">{s.value}</strong>
                            </div>
                        ))}
                    </div>

                    {/* Continue Learning */}
                    {continueLearning.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold mb-4 text-foreground">Continue Learning</h2>
                            <div className="space-y-4 mb-8">
                                {continueLearning.map((enrollment) => (
                                    <div key={enrollment.courseId} className="bg-card border border-border rounded-2xl p-5 flex gap-5 items-center flex-wrap">
                                        <div className="w-28 h-[72px] bg-gradient-to-br from-primary/40 to-purple-600/40 rounded-xl shrink-0" />
                                        <div className="flex-1 min-w-48">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-semibold text-foreground">{enrollment.title}</h4>
                                                <span className="text-xs px-2 py-0.5 rounded-full border border-teal-500/50 text-teal-500">Active</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                                                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${enrollment.progress}%` }} />
                                            </div>
                                            <p className="text-xs text-muted-foreground">{enrollment.progress}% Completed</p>
                                        </div>
                                        <Link href={`/dashboard/courses/${enrollment.courseId}/lessons`}
                                            className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm px-4 py-2.5 rounded-xl transition-all">
                                            <Play className="h-4 w-4" /> Continue
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* All Courses */}
                    {!loading && courses.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold mb-4 text-foreground">All Courses</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                                {courses.map((course) => {
                                    const cat = (course.category || 'default').toLowerCase();
                                    const dot = categoryColors[cat] || categoryColors.default;
                                    const gradient = categoryGradients[cat] || categoryGradients.default;
                                    return (
                                        <div key={course.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-primary/30 hover:-translate-y-1 transition-all group">
                                            <div className={`h-36 bg-gradient-to-br ${gradient} relative`}>
                                                {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-60" />}
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <span className="inline-block text-xs font-bold px-2 py-0.5 rounded border mb-2" style={{ color: dot, borderColor: `${dot}40`, background: `${dot}15` }}>{course.category || 'General'}</span>
                                                <h4 className="text-foreground font-bold text-sm mb-2 group-hover:text-primary transition-colors">{course.title}</h4>
                                                <p className="text-xs text-muted-foreground flex-1 line-clamp-2 mb-3">{course.description}</p>
                                                <Link href={`/dashboard/courses/${course.id}`}
                                                    className="flex items-center justify-center gap-1 border border-border rounded-lg text-foreground text-xs font-semibold py-2 hover:bg-muted hover:border-primary/40 transition-all">
                                                    View Course <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Recommended Courses */}
                    <h2 className="text-xl font-bold mb-4 text-foreground">Recommended For You</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {recommendedCourses.map((c) => (
                            <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-primary/30 hover:-translate-y-1 transition-all group">
                                <div className={`h-36 bg-gradient-to-br ${c.color} relative`}>
                                    {c.live && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <span className="inline-block text-xs font-bold px-2 py-0.5 rounded border mb-2" style={{ color: c.dot, borderColor: `${c.dot}40`, background: `${c.dot}15` }}>{c.tag}</span>
                                    <h4 className="text-foreground font-bold text-sm mb-2">{c.title}</h4>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: c.dot }}>{c.mentor[0]}</div>
                                        <span className="text-xs text-muted-foreground">{c.mentor}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xs text-muted-foreground">⏱️ {c.weeks}</span>
                                        <button className="border border-border rounded-lg text-foreground text-xs font-semibold px-3 py-1.5 hover:bg-muted hover:border-primary/40 transition-all">Enroll</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
