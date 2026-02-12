"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trophy, CheckCircle, ArrowRight, Clock } from "lucide-react";

export default function MockTestListPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [mockTests, setMockTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchTests(user.id);
        }
    }, [user]);

    const fetchTests = async (userId: string) => {
        try {
            setLoading(true);
            const res = await api.get(`/mock-tests?userId=${userId}`);
            setMockTests(res.data);
        } catch (error) {
            console.error("Failed to fetch mock tests", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading mock tests...</div>;

    if (!user) return <div className="p-8 text-center">Please log in to view mock tests.</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mock Tests</h1>
                <p className="text-muted-foreground mt-2">Practice tests from your enrolled courses.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockTests.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No mock tests available yet. Continue your lessons to unlock more!
                    </div>
                ) : (
                    mockTests.map((test) => {
                        const attempt = test.attempts?.[0];
                        const isCompleted = !!attempt;
                        const score = isCompleted ? attempt.score : 0;
                        const percentage = isCompleted ? attempt.percentage : 0;

                        return (
                            <Card key={test.id} className="flex flex-col border-l-4 border-l-primary hover:shadow-lg transition-all">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg pb-1">{test.title}</CardTitle>
                                            <CardDescription className="line-clamp-1">{test.lesson?.course?.title}</CardDescription>
                                        </div>
                                        {isCompleted && (
                                            <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Done
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Lesson: {test.lesson?.title}</span>
                                    </div>

                                    {isCompleted ? (
                                        <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm font-medium">Your Score</span>
                                            <span className={`font-bold ${percentage >= 75 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                                                {score}/{test.totalMarks} ({Math.round(percentage)}%)
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Total Marks</span>
                                            <span className="font-bold">{test.totalMarks}</span>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={isCompleted ? "outline" : "default"}
                                        onClick={() => router.push(`/dashboard/courses/${test.lesson.courseId}?lessonId=${test.lesson.id}&tab=mock-test`)}
                                    >
                                        {isCompleted ? "Retake Test" : "Start Test"}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
