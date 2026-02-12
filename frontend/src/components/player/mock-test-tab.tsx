"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ExternalLink, Trophy, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

interface MockTestTabProps {
    lessonId: string;
}

export function MockTestTab({ lessonId }: MockTestTabProps) {
    const [mockTest, setMockTest] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [karmaAwarded, setKarmaAwarded] = useState(0);

    useEffect(() => {
        const fetchTest = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/lessons/${lessonId}/mock-test`);
                setMockTest(res.data);
            } catch (error) {
                console.log("No mock test found or error", error);
                setMockTest(null);
            } finally {
                setLoading(false);
            }
        };
        if (lessonId) fetchTest();
    }, [lessonId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mockTest || !score) return;

        setSubmitting(true);
        try {
            // Get user ID from local storage or context (Assuming stored in auth token payload which we don't have direct access to without decoding)
            // But API needs userId.
            // TEMPORARY: Decode token or ask API to decode.
            // Better: Decode token here.

            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("Please login first");
                return;
            }

            // Simple approach: Send Request, let backend extract user from token if middleware exists. 
            // But I didn't implement middleware in the new API routes.
            // So I will send userId extracted from token if possible, or just fail for now?
            // Wait, I can decode the token here.

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            const userId = payload.sub || payload.id; // Usually sub in standard JWT

            const res = await api.post(`/lessons/${lessonId}/mock-test`, {
                userId,
                score: Number(score)
            });

            setKarmaAwarded(res.data.karmaAwarded);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit score. Check values.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading mock test...</div>;

    if (!mockTest) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground p-4">
                <Trophy className="h-12 w-12 mb-4 opacity-20" />
                <p>No mock test available for this lesson.</p>
            </div>
        );
    }

    if (submitted) {
        return (
            <Card className="max-w-md mx-auto mt-4 border-green-500/50 bg-green-500/10">
                <CardContent className="pt-6 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Score Submitted!</h2>
                    <p className="mb-4 text-muted-foreground">Your attempt has been recorded.</p>
                    {karmaAwarded > 0 && (
                        <div className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-3 rounded-lg font-bold inline-block">
                            + {karmaAwarded} KARMA EARNED!
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    {mockTest.title}
                </CardTitle>
                <CardDescription>
                    Total Marks: {mockTest.totalMarks} | Passing Marks: {mockTest.passingMarks}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Instructions:</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>Click "Take Mock Test" to open the Google Form.</li>
                        <li>Complete the quiz and submit it.</li>
                        <li>View your score on the confirmation screen of the Google Form.</li>
                        <li>Come back here and enter your score below.</li>
                    </ul>
                </div>

                <Button className="w-full" variant="outline" onClick={() => window.open(mockTest.googleFormLink, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Take Mock Test (Google Form)
                </Button>

                <div className="border-t pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Enter Your Score</label>
                            <Input
                                type="number"
                                placeholder={`0 - ${mockTest.totalMarks}`}
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                max={mockTest.totalMarks}
                                min={0}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Score"}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
