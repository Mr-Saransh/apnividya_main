
"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, RefreshCw, Save, Trash2, Plus, GripVertical } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function MockTestAdminPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [mockTests, setMockTests] = useState<any[]>([]);

    // Form State
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedLesson, setSelectedLesson] = useState("");
    const [difficulty, setDifficulty] = useState("Medium");
    const [questionCount, setQuestionCount] = useState(10);
    const [totalMarks, setTotalMarks] = useState(100);
    const [passingPercentage, setPassingPercentage] = useState(40);
    const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            console.error("Failed to fetch courses", error);
        }
    };

    const fetchLessons = async (courseId: string) => {
        try {
            const res = await api.get(`/admin/courses/${courseId}/lessons`);
            setLessons(res.data);
        } catch (error) {
            console.error("Failed to fetch lessons", error);
        }
    };

    const fetchMockTests = async () => {
        try {
            const res = await api.get("/admin/mock-tests"); // Ensure this endpoint returns mock tests with lesson/course info
            setMockTests(res.data);
        } catch (error) {
            console.error("Failed to fetch mock tests", error);
        }
    };

    const handleGenerate = async () => {
        if (!selectedLesson) {
            setError("Please select a lesson first.");
            return;
        }
        setGenerating(true);
        setError(null);
        setGeneratedQuestions([]);

        try {
            const res = await api.post("/admin/mock-test/generate", {
                lessonId: selectedLesson,
                difficulty,
                count: questionCount
            });

            if (res.data.questions) {
                setGeneratedQuestions(res.data.questions);
            } else {
                setError("No questions received from AI.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to generate questions.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        if (generatedQuestions.length === 0) return;
        setSaving(true);
        try {
            await api.post("/admin/mock-test/save", {
                lessonId: selectedLesson,
                totalMarks,
                passingPercentage,
                difficulty,
                questions: generatedQuestions,
                published: true
            });
            alert("Mock Test Saved Successfully!");
            setGeneratedQuestions([]);
            setSelectedCourse("");
            setSelectedLesson("");
            fetchMockTests();
        } catch (err: any) {
            console.error(err);
            alert("Failed to save mock test.");
        } finally {
            setSaving(false);
        }
    };

    // Editing Functions
    const handleQuestionChange = (index: number, field: string, value: any) => {
        const updated = [...generatedQuestions];
        updated[index] = { ...updated[index], [field]: value };
        setGeneratedQuestions(updated);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const updated = [...generatedQuestions];
        const newOptions = [...updated[qIndex].options];
        newOptions[oIndex] = value;

        // Also update individual option fields if they exist (legacy structure support)
        const optionKeys = ['optionA', 'optionB', 'optionC', 'optionD'];
        updated[qIndex] = {
            ...updated[qIndex],
            options: newOptions,
            [optionKeys[oIndex]]: value
        };

        setGeneratedQuestions(updated);
    };

    const handleAddQuestion = () => {
        setGeneratedQuestions([
            ...generatedQuestions,
            {
                question: "New Question",
                options: ["Option A", "Option B", "Option C", "Option D"],
                optionA: "Option A",
                optionB: "Option B",
                optionC: "Option C",
                optionD: "Option D",
                correctIndex: 0
            }
        ]);
    };

    const handleDeleteQuestion = (index: number) => {
        if (confirm("Delete this question?")) {
            const updated = generatedQuestions.filter((_, i) => i !== index);
            setGeneratedQuestions(updated);
        }
    };

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Mock Test Management</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* LEFT COLUMN: CREATION FORM */}
                <div className="md:col-span-1 lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create AI Mock Test</CardTitle>
                            <CardDescription>Generate questions using Gemini AI</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Course</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Lesson</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={selectedLesson}
                                    onChange={(e) => setSelectedLesson(e.target.value)}
                                    disabled={!selectedCourse}
                                >
                                    <option value="">Select Lesson</option>
                                    {lessons.map((l: any) => (
                                        <option key={l.id} value={l.id}>{l.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Questions</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                                    >
                                        <option value={5}>5 Questions</option>
                                        <option value={10}>10 Questions</option>
                                        <option value={15}>15 Questions</option>
                                        <option value={20}>20 Questions</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Total Marks</Label>
                                    <Input
                                        type="number"
                                        value={totalMarks}
                                        onChange={(e) => setTotalMarks(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Passing %</Label>
                                    <Input
                                        type="number"
                                        value={passingPercentage}
                                        onChange={(e) => setPassingPercentage(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <Button
                                onClick={handleGenerate}
                                disabled={generating || !selectedLesson}
                                className="w-full"
                            >
                                {generating ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                    </>
                                ) : (
                                    "Generate Mock Test"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: PREVIEW & LIST */}
                <div className="md:col-span-1 lg:col-span-4 space-y-6">
                    {generatedQuestions.length > 0 ? (
                        <Card className="border-green-200 bg-green-50/20">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Review & Edit ({generatedQuestions.length} Questions)</span>
                                    <div className="flex gap-2">
                                        <Button onClick={handleAddQuestion} variant="outline" size="sm" className="bg-white">
                                            <Plus className="mr-2 h-4 w-4" /> Add Question
                                        </Button>
                                        <Button onClick={handleSave} disabled={saving} variant="default" className="bg-green-600 hover:bg-green-700">
                                            {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save & Publish</>}
                                        </Button>
                                    </div>
                                </CardTitle>
                                <CardDescription>Review the questions below. You can edit the text, options, and correct answer before saving.</CardDescription>
                            </CardHeader>
                            <CardContent className="max-h-[700px] overflow-y-auto space-y-6 pr-2">
                                {generatedQuestions.map((q, qIdx) => (
                                    <div key={qIdx} className="p-4 bg-white rounded-lg border shadow-sm relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                onClick={() => handleDeleteQuestion(qIdx)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <div className="mt-2 text-muted-foreground font-mono text-sm">Q{qIdx + 1}</div>
                                                <div className="flex-1">
                                                    <Label className="sr-only">Question Text</Label>
                                                    <Textarea
                                                        value={q.question}
                                                        onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                                                        className="font-medium resize-none min-h-[60px]"
                                                        placeholder="Enter question text..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                                                {q.options.map((opt: string, oIdx: number) => (
                                                    <div key={oIdx} className="flex items-center gap-2">
                                                        <div
                                                            className={`flex items-center justify-center h-6 w-6 rounded-full border cursor-pointer ${q.correctIndex === oIdx
                                                                    ? "bg-green-600 border-green-600 text-white"
                                                                    : "border-gray-300 text-gray-400 hover:border-green-400"
                                                                }`}
                                                            onClick={() => handleQuestionChange(qIdx, 'correctIndex', oIdx)}
                                                            title="Mark as correct answer"
                                                        >
                                                            {q.correctIndex === oIdx && <CheckCircle2 className="h-4 w-4" />}
                                                        </div>
                                                        <Input
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                                            className={`h-9 ${q.correctIndex === oIdx ? "border-green-200 bg-green-50" : ""}`}
                                                            placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-center pt-4">
                                    <Button onClick={handleAddQuestion} variant="outline" className="w-full border-dashed">
                                        <Plus className="mr-2 h-4 w-4" /> Add Another Question
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Existing Mock Tests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm text-left">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b">
                                                <th className="h-10 px-2 font-medium">Lesson</th>
                                                <th className="h-10 px-2 font-medium">Q Count</th>
                                                <th className="h-10 px-2 font-medium">Difficulty</th>
                                                <th className="h-10 px-2 font-medium">Pass %</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockTests.length === 0 ? (
                                                <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No tests found.</td></tr>
                                            ) : (
                                                mockTests.map((test) => (
                                                    <tr key={test.id} className="border-b transition-colors hover:bg-muted/50">
                                                        <td className="p-2 font-medium">
                                                            <div>{test.lesson?.title}</div>
                                                            <div className="text-xs text-muted-foreground">{test.lesson?.course?.title}</div>
                                                        </td>
                                                        <td className="p-2">{test.questions?.length || 0}</td>
                                                        <td className="p-2 badge"><span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">{test.difficulty}</span></td>
                                                        <td className="p-2">{test.passingPercentage}%</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
