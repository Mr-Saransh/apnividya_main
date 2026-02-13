"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ExternalLink, Trophy, CheckCircle, XCircle, AlertCircle, Play, ChevronRight, Check } from "lucide-react";
import { api } from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface MockTestTabProps {
    lessonId: string;
}

export function MockTestTab({ lessonId }: MockTestTabProps) {
    const [mockTest, setMockTest] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTest = async () => {
            setLoading(true);
            try {
                // Get User ID from token if available
                const token = localStorage.getItem("accessToken");
                let userId = "";
                if (token) {
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        userId = JSON.parse(jsonPayload).sub || JSON.parse(jsonPayload).userId;
                    } catch (e) {
                        console.error("Token decode error", e);
                    }
                }

                const res = await api.get(`/lessons/${lessonId}/mock-test${userId ? `?userId=${userId}` : ''}`);
                setMockTest(res.data);
                if (res.data.attempt) {
                    setResult(res.data.attempt);
                    setSubmitted(true);
                }
            } catch (error) {
                console.log("No assessment found or error", error);
                setMockTest(null);
            } finally {
                setLoading(false);
            }
        };
        if (lessonId) fetchTest();
    }, [lessonId]);

    const handleOptionSelect = (questionId: string, optionIndex: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = async () => {
        if (!mockTest) return;

        // Ensure all questions answered?
        if (Object.keys(answers).length < mockTest.questions.length) {
            if (!confirm("You haven't answered all questions. Submit anyway?")) return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("Please login first");
                return;
            }

            // Extract userId
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const userId = JSON.parse(jsonPayload).sub || JSON.parse(jsonPayload).id || JSON.parse(jsonPayload).userId;

            const res = await api.post(`/lessons/${lessonId}/mock-test`, {
                userId,
                answers
            });

            setResult(res.data);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit test.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-10 flex items-center justify-center gap-2"><div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /> Loading mock test...</div>;

    if (!mockTest) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground p-4 bg-muted/20 rounded-lg border border-dashed">
                <Trophy className="h-12 w-12 mb-4 opacity-20" />
                <p>No mock test available for this lesson yet.</p>
            </div>
        );
    }

    if (!started && !submitted) {
        return (
            <Card className="mt-4 border-l-4 border-l-primary shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        {mockTest.lesson?.title || "Mock Test"}
                    </CardTitle>
                    <CardDescription>
                        Test your knowledge of this lesson with {mockTest.questions?.length} AI-generated questions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center text-center">
                            <span className="text-muted-foreground">Total Questions</span>
                            <span className="font-bold text-lg">{mockTest.questions?.length || 0}</span>
                        </div>
                        <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center text-center">
                            <span className="text-muted-foreground">Passing Score</span>
                            <span className="font-bold text-lg">{mockTest.passingPercentage}%</span>
                        </div>
                        <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center text-center">
                            <span className="text-muted-foreground">Difficulty</span>
                            <span className={`font-bold text-lg px-2 py-0.5 rounded ${mockTest.difficulty === 'Easy' ? 'text-green-600 bg-green-100' :
                                mockTest.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
                                    'text-red-600 bg-red-100'
                                }`}>{mockTest.difficulty}</span>
                        </div>
                        <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center text-center">
                            <span className="text-muted-foreground">Est. Time</span>
                            <span className="font-bold text-lg">~{Math.ceil((mockTest.questions?.length || 0) * 1.5)} min</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm flex gap-3 items-start">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Ready to begin?</p>
                            <p>Once you start, try to complete all questions. You can review your answers at the end.</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button size="lg" className="w-full font-bold text-lg h-12" onClick={() => setStarted(true)}>
                        Start Test <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    if (submitted) {
        const passed = result.passed || result.status === "PASSED";
        const percentage = result.percentage || 0;
        const score = result.score || 0;
        const totalMarks = mockTest.totalMarks || 100; // Fallback

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className={`border-t-4 ${passed ? "border-t-green-500 bg-green-50" : "border-t-red-500 bg-red-50"}`}>
                    <CardContent className="pt-6 text-center">
                        {passed ? (
                            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
                        ) : (
                            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                        )}
                        <h2 className="text-3xl font-bold mb-2">{passed ? "Congratulations!" : "Keep Practicing!"}</h2>
                        <div className="text-4xl font-extrabold mb-2 tracking-tight">
                            {percentage}%
                        </div>
                        <p className={`text-lg font-medium mb-6 ${passed ? "text-green-700" : "text-red-700"}`}>
                            {passed ? "You passed the test!" : "You didn't pass this time."}
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
                            <div className="bg-white/60 p-3 rounded-lg border">
                                <div className="text-xs text-muted-foreground uppercase">Score</div>
                                <div className="font-bold text-xl">{score}/{totalMarks}</div>
                            </div>
                            <div className="bg-white/60 p-3 rounded-lg border">
                                <div className="text-xs text-muted-foreground uppercase">Correct</div>
                                <div className="font-bold text-xl text-green-600">{result.correctCount !== undefined ? result.correctCount : "?"}/{mockTest.questions?.length}</div>
                            </div>
                            <div className="bg-white/60 p-3 rounded-lg border">
                                <div className="text-xs text-muted-foreground uppercase">Karma</div>
                                <div className="font-bold text-xl text-yellow-600">+{result.karmaChange || 0}</div>
                            </div>
                        </div>

                        {passed && (
                            <Button
                                onClick={() => setSubmitted(false)}
                                variant="outline"
                                className="mr-2"
                            >
                                Review Answers
                            </Button>
                        )}
                        <Button
                            onClick={() => { setStarted(false); setSubmitted(false); setAnswers({}); setResult(null); }}
                            className={passed ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                        >
                            Retake Test
                        </Button>
                    </CardContent>
                </Card>

                {/* Question Review (Simple list for now, ideally expand to show correct answers) */}
                {result.correctAnswers && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg px-1">Review Answers</h3>
                        {mockTest.questions.map((q: any, idx: number) => {
                            const userAns = answers[q.id];
                            const correctAns = result.correctAnswers[q.id];
                            const isCorrect = userAns === correctAns;

                            return (
                                <Card key={q.id} className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
                                    <CardHeader className="py-3">
                                        <CardTitle className="text-base flex items-start gap-2">
                                            <span className="bg-muted px-2 py-0.5 rounded text-sm shrink-0">Q{idx + 1}</span>
                                            {q.question}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="py-3 pt-0">
                                        <div className="space-y-2 text-sm ml-8">
                                            {['optionA', 'optionB', 'optionC', 'optionD'].map((optKey, oIdx) => {
                                                const isSelected = userAns === oIdx;
                                                const isActuallyCorrect = correctAns === oIdx;

                                                let style = "bg-muted/30 border-transparent text-muted-foreground";
                                                if (isActuallyCorrect) style = "bg-green-100 border-green-300 text-green-800 font-medium";
                                                else if (isSelected && !isActuallyCorrect) style = "bg-red-100 border-red-300 text-red-800";

                                                return (
                                                    <div key={optKey} className={`p-2 rounded border flex items-center gap-2 ${style}`}>
                                                        {isActuallyCorrect ? <Check className="h-4 w-4" /> : isSelected ? <XCircle className="h-4 w-4" /> : <div className="w-4" />}
                                                        <span>{q[optKey]}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-sm z-10">
                <span className="font-bold text-lg">Question {Object.keys(answers).length}/{mockTest.questions?.length}</span>
                <Progress value={(Object.keys(answers).length / (mockTest.questions?.length || 1)) * 100} className="w-1/3 h-2" />
                <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Test"}
                </Button>
            </div>

            <div className="space-y-6 pb-12">
                {mockTest.questions?.map((q: any, idx: number) => (
                    <Card key={q.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/10 pb-4">
                            <CardTitle className="text-lg flex gap-3">
                                <span className="flex items-center justify-center bg-primary text-primary-foreground h-8 w-8 rounded-full text-sm shrink-0">
                                    {idx + 1}
                                </span>
                                {q.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['optionA', 'optionB', 'optionC', 'optionD'].map((optKey, oIdx) => (
                                    <button
                                        key={optKey}
                                        onClick={() => handleOptionSelect(q.id, oIdx)}
                                        className={`text-left p-4 rounded-lg border-2 transition-all hover:bg-muted/50 ${answers[q.id] === oIdx
                                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                                            : "border-muted bg-transparent"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${answers[q.id] === oIdx ? "border-primary bg-primary text-white" : "border-muted-foreground"
                                                }`}>
                                                {answers[q.id] === oIdx && <div className="h-2 w-2 bg-white rounded-full" />}
                                            </div>
                                            <span className="text-sm font-medium">{q[optKey]}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center pt-6">
                <Button size="lg" className="px-12" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Test"}
                </Button>
            </div>
        </div>
    );
}
