"use client";

import { useState, useEffect, use, Suspense } from "react";
import { CustomVideoPlayer } from "@/components/player/custom-video-player";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Loader2, Video, Clock, Calendar, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

function CoursePlayerContent({ courseId }: { courseId: string }) {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") || "overview";

    const [course, setCourse] = useState<any>(null);
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(initialTab);

    // Countdown component for Scheduled lessons
    const Countdown = ({ targetDate }: { targetDate: string }) => {
        const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

        useEffect(() => {
            const timer = setInterval(() => {
                const now = new Date().getTime();
                const distance = new Date(targetDate).getTime() - now;

                if (distance < 0) {
                    clearInterval(timer);
                    setTimeLeft(null);
                } else {
                    setTimeLeft({
                        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
                        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        s: Math.floor((distance % (1000 * 60)) / 1000)
                    });
                }
            }, 1000);
            return () => clearInterval(timer);
        }, [targetDate]);

        if (!timeLeft) return <div className="text-xl font-bold text-red-500">Starting soon!</div>;

        return (
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold">{timeLeft.d}</span>
                    <span className="text-xs uppercase text-muted-foreground">Days</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold">{timeLeft.h}</span>
                    <span className="text-xs uppercase text-muted-foreground">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold">{timeLeft.m}</span>
                    <span className="text-xs uppercase text-muted-foreground">Mins</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold">{timeLeft.s}</span>
                    <span className="text-xs uppercase text-muted-foreground">Secs</span>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/courses/${courseId}`);
                setCourse(response.data);
                const urlLessonId = searchParams.get("lessonId");
                if (urlLessonId) {
                    setCurrentLessonId(urlLessonId);
                } else if (response.data.lessons?.length > 0) {
                    setCurrentLessonId(response.data.lessons[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch course:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [courseId, searchParams]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
                <h1 className="text-2xl font-bold">Course not found</h1>
                <p className="text-muted-foreground mt-2">The course you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    const currentLesson = course.lessons?.find((l: any) => l.id === currentLessonId);
    const activeVideoId = currentLesson?.youtubeVideoId || "";

    const handleNext = () => {
        const currentIndex = course.lessons.findIndex((l: any) => l.id === currentLessonId);
        if (currentIndex < course.lessons.length - 1) {
            setCurrentLessonId(course.lessons[currentIndex + 1].id);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:flex-row gap-4 p-4 lg:p-0">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 lg:p-6 overflow-y-auto">
                    {activeVideoId ? (
                        <CustomVideoPlayer
                            url={`https://www.youtube.com/watch?v=${activeVideoId}`}
                            title={currentLesson?.title || "Course Video"}
                            autoPlay={true}
                            onNext={handleNext}
                            hasNext={course?.lessons && currentLessonId && course.lessons.findIndex((l: any) => l.id === currentLessonId) < course.lessons.length - 1}
                        />
                    ) : (
                        <div className="aspect-video w-full bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-6 text-center border border-slate-800 shadow-2xl">
                            {currentLesson?.status === 'SCHEDULED' ? (
                                <>
                                    <div className="mb-4 bg-primary/20 p-4 rounded-full">
                                        <Clock className="h-12 w-12 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Live Session Scheduled</h2>
                                    <p className="text-slate-400 mb-6 max-w-md">This session hasn&apos;t started yet. Join us at the scheduled time below.</p>

                                    {currentLesson.liveMeetingAt && (
                                        <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700 mx-auto">
                                            <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide">Starts In</p>
                                            <Countdown targetDate={currentLesson.liveMeetingAt} />
                                            <p className="mt-4 text-sm font-medium text-slate-300">
                                                {new Date(currentLesson.liveMeetingAt).toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    {currentLesson.liveMeetingUrl && (
                                        <Button size="lg" className="rounded-full px-8 py-6 text-lg" onClick={() => window.open(currentLesson.liveMeetingUrl!, '_blank')}>
                                            <Video className="h-5 w-5 mr-2" /> Join Live Class
                                        </Button>
                                    )}
                                </>
                            ) : currentLesson?.status === 'LIVE' ? (
                                <>
                                    <div className="mb-4 bg-red-500/20 p-4 rounded-full animate-pulse">
                                        <Video className="h-12 w-12 text-red-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Live Session in Progress</h2>
                                    <p className="text-slate-400 mb-8 max-w-md">Join the interactive session now to participate in discussions.</p>

                                    {currentLesson.liveMeetingUrl && (
                                        <Button size="lg" variant="destructive" className="rounded-full px-8 py-6 text-lg animate-bounce" onClick={() => window.open(currentLesson.liveMeetingUrl!, '_blank')}>
                                            <Video className="h-5 w-5 mr-2" /> Join Live Class Now
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="mb-4 bg-slate-800 p-4 rounded-full">
                                        <PlayCircle className="h-12 w-12 text-slate-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2 text-slate-300">Video Coming Soon</h2>
                                    <p className="text-slate-500 max-w-sm">The recording for this session is being processed and will be available shortly.</p>
                                </>
                            )}
                        </div>
                    )}

                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{currentLesson?.title || course.title}</h1>
                                <p className="text-muted-foreground mt-1">Course: {course.title}</p>
                            </div>
                            {currentLesson?.status && (
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                                    currentLesson.status === 'SCHEDULED' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                        currentLesson.status === 'LIVE' ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse" :
                                            "bg-green-500/10 text-green-500 border-green-500/20"
                                )}>
                                    {currentLesson.status}
                                </div>
                            )}
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                            <TabsList className="bg-muted/50 p-1">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                {currentLesson?.status !== 'RECORDED' && currentLesson?.status !== 'PUBLISHED' && (
                                    <TabsTrigger value="live">Live Session</TabsTrigger>
                                )}
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="mt-4">
                                <Card className="border-none bg-muted/30">
                                    <CardHeader>
                                        <CardTitle>{currentLesson?.title || "Lesson Overview"}</CardTitle>
                                        <CardDescription>{currentLesson?.description || "Key concepts covered in this lesson."}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose prose-sm dark:prose-invert">
                                            {course.description}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {currentLesson?.status !== 'RECORDED' && currentLesson?.status !== 'PUBLISHED' && (
                                <TabsContent value="live" className="mt-4">
                                    <Card className="border-dashed">
                                        <CardHeader className="text-center">
                                            <CardTitle>Join the Interactive Session</CardTitle>
                                            <CardDescription>Participate in live discussions and get your doubts resolved in real-time.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                                            {currentLesson?.liveMeetingUrl ? (
                                                <Button size="lg" className="px-10" onClick={() => window.open(currentLesson.liveMeetingUrl!, '_blank')}>
                                                    <Video className="h-4 w-4 mr-2" /> Open External Link
                                                </Button>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-muted rounded-full p-4 mb-3">
                                                        <Video className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground max-w-xs">
                                                        The link will appear here once the session is about to start.
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}
                            <TabsContent value="notes" className="mt-4">
                                <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
                                    Notes for this lesson will be available soon.
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Course Sidebar */}
            <div className="w-full md:w-80 lg:w-96 border-l bg-muted/10 flex flex-col">
                <div className="p-4 border-b font-semibold flex items-center justify-between">
                    Course Lessons
                    <span className="text-xs text-muted-foreground">{course.lessons?.length || 0} Lessons</span>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {course.lessons?.map((lesson: any) => (
                            <button
                                key={lesson.id}
                                onClick={() => setCurrentLessonId(lesson.id)}
                                className={`w-full flex items-center gap-3 p-4 text-sm transition-colors hover:bg-muted ${currentLessonId === lesson.id ? "bg-accent text-accent-foreground border-l-2 border-primary" : ""
                                    }`}
                            >
                                <PlayCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 text-left line-clamp-1">
                                    {lesson.title}
                                </div>
                                <span className="text-xs text-muted-foreground">{Math.floor((lesson.duration || 0) / 60)}m</span>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

export default function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = use(params);
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>}>
            <CoursePlayerContent courseId={courseId} />
        </Suspense>
    );
}
