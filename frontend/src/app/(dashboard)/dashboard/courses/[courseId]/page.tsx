"use client";

import { useState, useEffect, use } from "react";
import { CustomVideoPlayer } from "@/components/player/custom-video-player";
import { MockTestTab } from "@/components/player/mock-test-tab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Loader2, Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";

import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = use(params);
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") || "overview";

    const [course, setCourse] = useState<any>(null);
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
    }, [courseId]);

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

    const currentLesson = course.lessons.find((l: any) => l.id === currentLessonId);
    const activeVideoId = currentLesson?.youtubeVideoId || "";

    const handleNext = () => {
        const currentIndex = course.lessons.findIndex((l: any) => l.id === currentLessonId);
        if (currentIndex < course.lessons.length - 1) {
            setCurrentLessonId(course.lessons[currentIndex + 1].id);
        }
    };

    const [activeTab, setActiveTab] = useState(initialTab);

    // Sync tab with URL if needed, but for now just use initial state unless deep linking changes within same page
    // Actually, simple Controlled component is enough.

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:flex-row gap-4 p-4 lg:p-0">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 lg:p-6 overflow-y-auto">
                    <CustomVideoPlayer
                        url={activeVideoId.startsWith("http") ? activeVideoId : `https://www.youtube.com/watch?v=${activeVideoId}`}
                        title={currentLesson?.title || "Course Video"}
                        autoPlay={true}
                        onNext={handleNext}
                        hasNext={course?.lessons && currentLessonId && course.lessons.findIndex((l: any) => l.id === currentLessonId) < course.lessons.length - 1}
                    />

                    <div className="mt-6">
                        <h1 className="text-2xl font-bold">{course.title}</h1>
                        <p className="text-muted-foreground mt-1">Instructor: {course.instructor?.fullName || "Anonymous"}</p>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="mock-test">Mock Test</TabsTrigger>
                                <TabsTrigger value="live">Live Session</TabsTrigger>
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{currentLesson?.title || "Lesson Overview"}</CardTitle>
                                        <CardDescription>{currentLesson?.description || "Key concepts covered in this video."}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">
                                            {course.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="mock-test" className="mt-4">
                                {currentLessonId ? (
                                    <MockTestTab lessonId={currentLessonId} />
                                ) : (
                                    <div className="text-center text-muted-foreground p-8">Select a lesson to view mock test.</div>
                                )}
                            </TabsContent>
                            <TabsContent value="live" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2 text-red-500 animate-pulse mb-2">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Live Now</span>
                                        </div>
                                        <CardTitle>Join the Interactive Session</CardTitle>
                                        <CardDescription>Participate in live discussions and get your doubts resolved in real-time.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                        <div className="bg-muted rounded-full p-6 mb-4">
                                            <Video className="h-10 w-10 text-muted-foreground" />
                                        </div>
                                        {currentLesson?.liveMeetingAt && (
                                            <h3 className="text-lg font-semibold mb-2">
                                                Scheduled: {new Date(currentLesson.liveMeetingAt).toLocaleString()}
                                            </h3>
                                        )}
                                        {currentLesson?.liveMeetingUrl ? (
                                            <Button className="mt-6 w-full max-w-sm" onClick={() => window.open(currentLesson.liveMeetingUrl, '_blank')}>
                                                <Video className="h-4 w-4 mr-2" /> Join Live Class
                                            </Button>
                                        ) : (
                                            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                                Wait for the link... The instructor has not started the session yet.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
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

