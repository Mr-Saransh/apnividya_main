"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Flame,
    Star,
    Trophy,
    ArrowRight,
    PlayCircle,
    Zap,
    Crown,
    BookOpen
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface DashboardStats {
    karmaPoints: number;
    globalRank: number;
    percentile: number; // Top X% of students
    dayStreak: number;
    lessonsCompleted: number;
    lessonsThisWeek: number;
    continueLearning: Array<{
        courseId: string;
        title: string;
        thumbnail: string | null;
        progress: number;
    }>;
    achievements: Array<{
        id: number;
        name: string;
        icon: string;
        color: string;
    }>;
}

interface DailyChallenge {
    title: string;
    description: string;
    totalQuestions: number;
    completed: number;
    progress: number;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsResponse, challengeResponse] = await Promise.all([
                    api.get("/dashboard/stats"),
                    api.get("/dashboard/daily-challenge"),
                ]);
                setStats(statsResponse.data);
                setChallenge(challengeResponse.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = stats
        ? [
            {
                label: "Karma Points",
                value: stats.karmaPoints.toLocaleString(),
                icon: Star,
                color: "text-yellow-400",
                desc: `Top ${stats.percentile}% Student`,
            },
            {
                label: "Day Streak",
                value: `${stats.dayStreak} Days`,
                icon: Flame,
                color: "text-orange-500",
                desc: stats.dayStreak > 0 ? "Keep it up!" : "Start today!",
            },
            {
                label: "Lessons Done",
                value: stats.lessonsCompleted.toString(),
                icon: BookOpen,
                color: "text-blue-400",
                desc: `${stats.lessonsThisWeek} this week`,
            },
            {
                label: "Global Rank",
                value: `#${stats.globalRank.toLocaleString()}`,
                icon: Trophy,
                color: "text-purple-400",
                desc: stats.globalRank <= 1000 ? "Top performer!" : "Moving up fast",
            },
        ]
        : [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome back, <span className="text-primary">{user?.fullName || "Scholar"}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild className="font-bold shadow-lg shadow-primary/20">
                        {stats?.continueLearning && stats.continueLearning.length > 0 ? (
                            <Link href={`/dashboard/courses/${stats.continueLearning[0].courseId}`}>
                                <Zap className="mr-2 h-4 w-4 fill-current" />
                                Resume Learning
                            </Link>
                        ) : (
                            <Link href="/dashboard/courses">
                                <PlayCircle className="mr-2 h-4 w-4 fill-current" />
                                Start Learning
                            </Link>
                        )}
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4 rounded" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-20 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))
                    : statCards.map((stat, i) => (
                        <Card
                            key={i}
                            className="border-border/50 bg-card/50 backdrop-blur hover:bg-card hover:border-primary/30 transition-all duration-300"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
            </div>

            {/* Main Content Split */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* Left Column: Learning (4/7) */}
                <Card className="col-span-1 md:col-span-4 border-border/50 bg-card/50 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlayCircle className="h-5 w-5 text-primary" />
                            {stats?.continueLearning && stats.continueLearning.length > 0 ? "Continue Learning" : "Start Learning"}
                        </CardTitle>
                        <CardDescription>
                            {stats?.continueLearning && stats.continueLearning.length > 0
                                ? "Pick up exactly where you left off."
                                : "Begin your journey today with our curated courses."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1">
                        {loading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-3">
                                    <Skeleton className="h-16 w-24 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                        <Skeleton className="h-2 w-full" />
                                    </div>
                                </div>
                            ))
                        ) : (!stats?.continueLearning || stats.continueLearning.length === 0) ? (
                            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                                <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No courses in progress</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Explore our catalog and enroll in your first course to start earning achievements!
                                </p>
                                <Button asChild size="lg" className="px-8 shadow-lg shadow-primary/20">
                                    <Link href="/dashboard/courses">Browse Courses</Link>
                                </Button>
                            </div>
                        ) : (
                            stats.continueLearning.map((item, i) => (
                                <Link
                                    key={i}
                                    href={`/dashboard/courses/${item.courseId}`}
                                    className="group flex items-center gap-4 rounded-xl border border-border/40 p-3 hover:bg-accent/50 hover:border-primary/20 transition-all"
                                >
                                    {/* Thumbnail */}
                                    <div
                                        className={`h-16 w-24 rounded-lg shadow-inner flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity bg-cover bg-center bg-gray-200 relative overflow-hidden`}
                                        style={
                                            item.thumbnail
                                                ? { backgroundImage: `url(${item.thumbnail})` }
                                                : undefined
                                        }
                                    >
                                        {!item.thumbnail && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500">
                                                <BookOpen className="h-6 w-6 text-white/50" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center gap-2 pt-1">
                                            <Progress value={item.progress} className="h-1.5" />
                                            <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                                                {item.progress}%
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        asChild
                                        className="rounded-full hover:bg-primary hover:text-primary-foreground shrink-0"
                                    >
                                        <PlayCircle className="h-6 w-6" />
                                    </Button>
                                </Link>
                            ))
                        )}
                    </CardContent>
                    {stats?.continueLearning && stats.continueLearning.length > 0 && (
                        <CardFooter>
                            <Button asChild variant="ghost" className="w-full text-muted-foreground hover:text-primary">
                                <Link href="/dashboard/courses">
                                    View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Right Column: Challenge/Badges (3/7) */}
                <div className="col-span-1 md:col-span-3 space-y-6">
                    {/* Daily Challenge */}
                    <Card className="border-primary/20 bg-gradient-to-b from-card to-card/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Trophy className="h-24 w-24 text-primary" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-primary">
                                {loading ? <Skeleton className="h-6 w-32" /> : challenge?.title}
                            </CardTitle>
                            <CardDescription>
                                {loading ? <Skeleton className="h-4 w-48" /> : challenge?.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <>
                                    <Skeleton className="h-8 w-16 mb-2" />
                                    <Skeleton className="h-2 w-full" />
                                </>
                            ) : (
                                <>
                                    <div className="flex items-end justify-between mb-2">
                                        <span className="text-2xl font-bold">
                                            {challenge?.completed}/{challenge?.totalQuestions}
                                        </span>
                                        <span className="text-sm text-muted-foreground">{challenge?.progress}%</span>
                                    </div>
                                    <Progress value={challenge?.progress || 0} className="h-2 bg-primary/20" />
                                </>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                asChild
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                disabled={loading}
                            >
                                <Link href="/dashboard/mock-test">Start Quiz</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Recent Achievements */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crown className="h-5 w-5 text-yellow-500" />
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-4 gap-2">
                            {loading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="aspect-square rounded-full" />
                                ))
                                : (stats?.achievements.slice(0, 4) || []).map((achievement, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square rounded-full bg-accent flex items-center justify-center border border-border hover:border-primary cursor-pointer transition-all hover:scale-110"
                                        title={achievement.name}
                                    >
                                        <Trophy className={`h-5 w-5 text-${achievement.color}-500`} />
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
