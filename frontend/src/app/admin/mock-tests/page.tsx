"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MockTestAdminPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [mockTests, setMockTests] = useState<any[]>([]);

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedLesson, setSelectedLesson] = useState("");
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [totalMarks, setTotalMarks] = useState(100);
    const [passingMarks, setPassingMarks] = useState(40);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
        fetchMockTests();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchLessons(selectedCourse);
        } else {
            setLessons([]);
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const res = await api.get("/admin/courses");
            setCourses(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLessons = async (courseId: string) => {
        try {
            const res = await api.get(`/admin/courses/${courseId}/lessons`);
            setLessons(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMockTests = async () => {
        try {
            const res = await api.get("/admin/mock-tests");
            setMockTests(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/admin/mock-tests", {
                lessonId: selectedLesson,
                title,
                googleFormLink: link,
                totalMarks,
                passingMarks,
                published: true
            });
            alert("Mock Test created!");
            fetchMockTests();
            setTitle("");
            setLink("");
            setSelectedCourse("");
            setSelectedLesson("");
        } catch (error) {
            console.error(error);
            alert("Failed to create mock test");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Mock Tests</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* CREATE FORM */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Mock Test</CardTitle>
                        <CardDescription>Link a Google Form to a Lesson</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Course</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    required
                                >
                                    <option value="">Select a Course</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Lesson</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedLesson}
                                    onChange={(e) => setSelectedLesson(e.target.value)}
                                    disabled={!selectedCourse}
                                    required
                                >
                                    <option value="">Select a Lesson</option>
                                    {lessons.map(l => (
                                        <option key={l.id} value={l.id}>{l.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Mock Test Title</Label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chapter 1 Quiz" required />
                            </div>

                            <div className="space-y-2">
                                <Label>Google Form Link</Label>
                                <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://docs.google.com/forms/..." required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Total Marks</Label>
                                    <Input type="number" value={totalMarks} onChange={e => setTotalMarks(Number(e.target.value))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Passing Marks</Label>
                                    <Input type="number" value={passingMarks} onChange={e => setPassingMarks(Number(e.target.value))} required />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating..." : "Create Mock Test"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* LIST TABLE */}
                <Card>
                    <CardHeader>
                        <CardTitle>Existing Mock Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Title</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Lesson</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Marks</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {mockTests.length === 0 ? (
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td colSpan={3} className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-center text-muted-foreground">No mock tests found.</td>
                                        </tr>
                                    ) : (
                                        mockTests.map((test) => (
                                            <tr key={test.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">{test.title}</td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                    <div className="text-xs text-muted-foreground">{test.lesson?.course?.title}</div>
                                                    {test.lesson?.title}
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                    {test.passingMarks}/{test.totalMarks}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
