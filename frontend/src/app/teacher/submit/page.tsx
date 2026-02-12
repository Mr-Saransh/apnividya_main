"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function SubmitForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [link, setLink] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

        axios.get(`${API_URL}/teacher/validate?token=${token}`)
            .then((res) => {
                setValid(true);
                setData(res.data.data);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Invalid or expired token");
                setValid(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

        try {
            await axios.post(`${API_URL}/teacher/submit`, {
                token,
                link,
                notes
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error && !success) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="flex items-center text-red-700">
                            <XCircle className="mr-2 h-5 w-5" />
                            Error
                        </CardTitle>
                        <CardDescription className="text-red-600">
                            {error}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md border-green-200 bg-green-50">
                    <CardHeader>
                        <CardTitle className="flex items-center text-green-700">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Submission Received
                        </CardTitle>
                        <CardDescription className="text-green-600">
                            Thank you! Your class link has been submitted successfully to the admin team.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Teacher Submission
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Submit your class recording for processing.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{data?.lessonTitle}</CardTitle>
                        <CardDescription>{data?.courseTitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="link">Class Recording / Live Link</Label>
                                <Input
                                    id="link"
                                    placeholder="https://drive.google.com/..."
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Paste the Google Drive, Zoom, or other cloud storage link here.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes for Admin (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Any specific instructions, timestamps, or issues..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Class
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function TeacherSubmitPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <SubmitForm />
        </Suspense>
    );
}
