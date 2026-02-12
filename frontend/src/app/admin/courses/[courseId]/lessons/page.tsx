"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Video, Link as LinkIcon, AlertCircle, Copy, Check, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminLessonsPage() {
    const params = useParams();
    const courseId = params.courseId;

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generatingToken, setGeneratingToken] = useState<string | null>(null);
    const [newTokenLink, setNewTokenLink] = useState<string | null>(null);

    // New Lesson Form
    const [newLessonTitle, setNewLessonTitle] = useState("");
    const [newLessonDesc, setNewLessonDesc] = useState("");
    const [addingLesson, setAddingLesson] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await api.get(`/admin/courses/${courseId}`);
            setCourse(res.data);
        } catch (error) {
            console.error("Failed to fetch course", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingLesson(true);

        try {
            await api.post(`/admin/courses/${courseId}/lessons`, {
                title: newLessonTitle,
                description: newLessonDesc,
                order: (course.lessons?.length || 0) + 1
            });
            setNewLessonTitle("");
            setNewLessonDesc("");
            fetchCourse(); // Refresh list
        } catch (error) {
            console.error(error);
        } finally {
            setAddingLesson(false);
        }
    };

    const handleGenerateToken = async (lessonId: string) => {
        setGeneratingToken(lessonId);

        try {
            const res = await api.post(`/admin/lessons/${lessonId}/token`, {});

            const link = `${window.location.origin}/teacher/submit?token=${res.data.token}`;
            setNewTokenLink(link);
            fetchCourse();
        } catch (error) {
            console.error(error);
        } finally {
            setGeneratingToken(null);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm("Are you sure you want to delete this lesson?")) return;

        try {
            await api.delete(`/admin/lessons/${lessonId}`);
            fetchCourse();
        } catch (error) {
            console.error(error);
            alert("Failed to delete lesson");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Link copied!");
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{course?.title}</h1>
                    <p className="text-muted-foreground">{course?.description}</p>
                    <div className="mt-2 text-sm font-medium text-green-600">
                        Price: ₹{course?.price || 0}
                    </div>
                </div>
                {course && <EditCourseDialog course={course} onUpdate={fetchCourse} />}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Lesson List */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold">Lessons</h2>
                    {course?.lessons?.map((lesson: any) => (
                        <Card key={lesson.id} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <span className="bg-muted text-muted-foreground text-xs font-mono px-2 py-1 rounded">#{lesson.order}</span>
                                            {lesson.title}
                                        </CardTitle>
                                        <CardDescription className="mt-1">{lesson.description}</CardDescription>
                                        {lesson.liveMeetingAt && (
                                            <div className="text-xs text-blue-600 mt-1 font-medium">
                                                Live: {new Date(lesson.liveMeetingAt).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lesson.status === 'PUBLISHED' ? (
                                            <Badge variant="success" className="bg-green-600 text-white">Published</Badge>
                                        ) : (
                                            <Badge variant="secondary">Waiting Video</Badge>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <EditLessonDialog lesson={lesson} onUpdate={fetchCourse} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        {lesson.youtubeVideoId ? (
                                            <div className="text-green-600 flex items-center"><Video className="w-4 h-4 mr-1" /> Video Linked</div>
                                        ) : (
                                            <div className="text-orange-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> No Video</div>
                                        )}
                                        {lesson.liveMeetingUrl && (
                                            <div className="text-blue-600 flex items-center"><LinkIcon className="w-4 h-4 mr-1" /> Live Link Set</div>
                                        )}
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleGenerateToken(lesson.id)}
                                        disabled={generatingToken === lesson.id}
                                    >
                                        {generatingToken === lesson.id ? <Loader2 className="animate-spin w-4 h-4" /> : <LinkIcon className="w-4 h-4 mr-2" />}
                                        Generate Teacher Link
                                    </Button>
                                </div>
                                {newTokenLink && generatingToken === null && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between text-sm text-blue-800">
                                        <span className="truncate flex-1 mr-2">{newTokenLink}</span>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(newTokenLink)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Add Lesson Form */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Lesson</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddLesson} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={newLessonTitle}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLessonTitle(e.target.value)}
                                        required
                                        placeholder="Lesson Title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={newLessonDesc}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewLessonDesc(e.target.value)}
                                        placeholder="Overview..."
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={addingLesson}>
                                    {addingLesson ? <Loader2 className="animate-spin mr-2" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                    Add Lesson
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}

// Minimal Badge replacement
function Badge({ children, className, variant }: any) {
    return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className} ${variant === 'secondary' ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80'}`}>{children}</span>
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react";

function EditLessonDialog({ lesson, onUpdate }: { lesson: any, onUpdate: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: lesson.title,
        description: lesson.description || "",
        youtubeVideoId: lesson.youtubeVideoId || "",
        liveMeetingUrl: lesson.liveMeetingUrl || "",
        liveMeetingAt: lesson.liveMeetingAt ? new Date(lesson.liveMeetingAt).toISOString().slice(0, 16) : ""
    });

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await api.patch(`/admin/lessons/${lesson.id}`, {
                ...formData,
                liveMeetingAt: formData.liveMeetingAt || null // Handle empty string
            });
            onUpdate();
            setOpen(false);
        } catch (error) {
            console.error("Failed to update lesson", error);
            alert("Failed to update");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Lesson</DialogTitle>
                    <DialogDescription>
                        Update lesson details like video ID and Live Session link.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="videoId">YouTube Video ID</Label>
                        <Input
                            id="videoId"
                            placeholder="e.g. dQw4w9WgXcQ"
                            value={formData.youtubeVideoId}
                            onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="liveUrl">Live Meeting URL</Label>
                        <Input
                            id="liveUrl"
                            placeholder="https://meet.google.com/..."
                            value={formData.liveMeetingUrl}
                            onChange={(e) => setFormData({ ...formData, liveMeetingUrl: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="liveTime">Live Meeting Time</Label>
                        <Input
                            id="liveTime"
                            type="datetime-local"
                            value={formData.liveMeetingAt}
                            onChange={(e) => setFormData({ ...formData, liveMeetingAt: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleUpdate} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditCourseDialog({ course, onUpdate }: { course: any, onUpdate: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: course.title,
        description: course.description,
        price: course.price || 0,
        level: course.level || "Beginner",
        language: course.language || "English",
        published: course.published,
        thumbnailUrl: course.thumbnailUrl
    });

    const handleChange = (e: any) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : (e.target.type === 'number' ? Number(e.target.value) : e.target.value);
        setFormData({ ...formData, [e.target.id]: value });
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await api.patch(`/admin/courses/${course.id}`, formData);
            onUpdate();
            setOpen(false);
        } catch (error) {
            console.error("Failed to update course", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Course Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={formData.title} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price (INR)</Label>
                        <Input type="number" id="price" value={formData.price} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="level">Level</Label>
                        <Input id="level" value={formData.level} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="language">Language</Label>
                        <Input id="language" value={formData.language} onChange={handleChange} />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="checkbox"
                            id="published"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={formData.published}
                            onChange={handleChange}
                        />
                        <Label htmlFor="published">Published</Label>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                        <Input id="thumbnailUrl" value={formData.thumbnailUrl || ''} onChange={handleChange} placeholder="https://..." />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleUpdate} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
