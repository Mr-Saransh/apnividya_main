"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, CheckCircle, Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Dialog imports removed as they were unused and causing accessibility warnings.

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [youtubeId, setYoutubeId] = useState("");

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await api.get('/admin/submissions');
            setSubmissions(res.data);
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (submission: any) => {
        if (!youtubeId) return alert("Please enter a YouTube Video ID");

        setProcessingId(submission.id);

        try {
            // 1. Publish lesson
            await api.patch(`/admin/lessons/${submission.lessonId}/publish`, {
                youtubeVideoId: youtubeId
            });

            // 2. Refresh
            setYoutubeId("");
            fetchSubmissions();
        } catch (error) {
            console.error("Failed to publish", error);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Pending Submissions</h1>

            <div className="grid gap-4">
                {submissions.map((sub) => (
                    <Card key={sub.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>{sub.lesson?.title}</span>
                                <span className="text-sm font-normal text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</span>
                            </CardTitle>
                            <CardDescription>
                                {sub.lesson?.course?.title}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-3 bg-muted rounded-md text-sm">
                                    <p className="font-semibold mb-1">Teacher's Note:</p>
                                    <p>{sub.notes || "No notes provided."}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a href={sub.submittedLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        View Submitted Recording
                                    </a>
                                </div>

                                <div className="flex items-end gap-2 border-t pt-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium">Video ID or URL</label>
                                        <Input
                                            placeholder="e.g. dQw4w9WgXcQ or https://youtu.be/..."
                                            value={processingId === sub.id ? youtubeId : ""} // Only show for active one or use individual state. For simplicity, just one at a time.
                                            onChange={(e) => {
                                                if (processingId !== sub.id) {
                                                    setYoutubeId(e.target.value);
                                                    setProcessingId(sub.id); // Hacky focus
                                                } else {
                                                    setYoutubeId(e.target.value);
                                                }
                                            }}
                                            onFocus={() => setProcessingId(sub.id)}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => handlePublish(sub)}
                                        disabled={processingId === sub.id && loading}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Publish
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {submissions.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No pending submissions.
                    </div>
                )}
            </div>
        </div>
    );
}
