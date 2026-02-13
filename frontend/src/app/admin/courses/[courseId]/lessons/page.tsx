"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Video, Link as LinkIcon, AlertCircle, Trash2, Calendar, Clock, ExternalLink, Youtube } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

// ========== STATUS BADGE ==========
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
        LIVE: "bg-red-100 text-red-700 border-red-200",
        RECORDED: "bg-yellow-100 text-yellow-700 border-yellow-200",
        PUBLISHED: "bg-green-100 text-green-700 border-green-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
            {status}
        </span>
    );
}

// ========== MAIN PAGE ==========
export default function AdminLessonsPage() {
    const params = useParams();
    const courseId = params.courseId;

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // New Lesson Form
    const [newLessonTitle, setNewLessonTitle] = useState("");
    const [newLessonDesc, setNewLessonDesc] = useState("");
    const [newLessonLiveLink, setNewLessonLiveLink] = useState("");
    const [newLessonScheduledAt, setNewLessonScheduledAt] = useState("");
    const [newLessonVideoId, setNewLessonVideoId] = useState("");
    const [newLessonStatus, setNewLessonStatus] = useState("SCHEDULED");
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
                liveMeetingUrl: newLessonLiveLink || null,
                liveMeetingAt: newLessonScheduledAt || null,
                youtubeVideoId: newLessonVideoId || null,
                status: newLessonStatus,
                order: (course.lessons?.length || 0) + 1
            });
            // Reset form
            setNewLessonTitle("");
            setNewLessonDesc("");
            setNewLessonLiveLink("");
            setNewLessonScheduledAt("");
            setNewLessonVideoId("");
            setNewLessonStatus("SCHEDULED");
            fetchCourse();
        } catch (error) {
            console.error(error);
            alert("Failed to add lesson");
        } finally {
            setAddingLesson(false);
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
                    <h2 className="text-xl font-semibold">Lessons ({course?.lessons?.length || 0})</h2>
                    {course?.lessons?.length === 0 && (
                        <p className="text-muted-foreground text-sm">No lessons yet. Add your first lesson.</p>
                    )}
                    {course?.lessons?.map((lesson: any) => (
                        <Card key={lesson.id} className={`border-l-4 ${lesson.status === 'PUBLISHED' ? 'border-l-green-500' :
                            lesson.status === 'RECORDED' ? 'border-l-yellow-500' :
                                lesson.status === 'LIVE' ? 'border-l-red-500' :
                                    'border-l-blue-500'
                            }`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <span className="bg-muted text-muted-foreground text-xs font-mono px-2 py-1 rounded">#{lesson.order}</span>
                                            {lesson.title}
                                        </CardTitle>
                                        <CardDescription className="mt-1">{lesson.description}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={lesson.status} />
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
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                    {lesson.youtubeVideoId ? (
                                        <div className="bg-green-50 text-green-700 px-2 py-1 rounded flex items-center gap-1.5 border border-green-100">
                                            <Video className="w-4 h-4" />
                                            <span className="font-medium">Video ID: {lesson.youtubeVideoId}</span>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 text-gray-500 px-2 py-1 rounded flex items-center gap-1.5 border border-gray-100 italic">
                                            <Video className="w-4 h-4 opacity-50" />
                                            <span>No recording</span>
                                        </div>
                                    )}
                                    {lesson.liveMeetingUrl ? (
                                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center gap-1.5 border border-blue-100">
                                            <ExternalLink className="w-4 h-4" />
                                            <a href={lesson.liveMeetingUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                                                Join Link
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 text-gray-500 px-2 py-1 rounded flex items-center gap-1.5 border border-gray-100 italic">
                                            <ExternalLink className="w-4 h-4 opacity-50" />
                                            <span>No live link</span>
                                        </div>
                                    )}
                                    {lesson.liveMeetingAt && (
                                        <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded flex items-center gap-1.5 border border-purple-100">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(lesson.liveMeetingAt).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Add Lesson Form */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PlusCircle className="h-5 w-5" /> Add Lesson
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddLesson} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title *</Label>
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
                                        placeholder="Brief overview..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <select
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={newLessonStatus}
                                        onChange={(e) => setNewLessonStatus(e.target.value)}
                                    >
                                        <option value="SCHEDULED">Scheduled</option>
                                        <option value="LIVE">Live</option>
                                        <option value="RECORDED">Recorded</option>
                                        <option value="PUBLISHED">Published</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Live Class Link</Label>
                                    <Input
                                        value={newLessonLiveLink}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLessonLiveLink(e.target.value)}
                                        placeholder="https://meet.google.com/..."
                                    />
                                    <p className="text-xs text-muted-foreground">Google Meet, Zoom, etc.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Scheduled Date & Time</Label>
                                    <Input
                                        type="datetime-local"
                                        value={newLessonScheduledAt}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLessonScheduledAt(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>YouTube Video ID</Label>
                                    <Input
                                        value={newLessonVideoId}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLessonVideoId(e.target.value)}
                                        placeholder="e.g. dQw4w9WgXcQ"
                                    />
                                    <p className="text-xs text-muted-foreground">Paste after uploading recording to YouTube</p>
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
        </div>
    );
}

// ========== EDIT LESSON DIALOG ==========
function EditLessonDialog({ lesson, onUpdate }: { lesson: any, onUpdate: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: lesson.title,
        description: lesson.description || "",
        youtubeVideoId: lesson.youtubeVideoId || "",
        liveMeetingUrl: lesson.liveMeetingUrl || "",
        liveMeetingAt: lesson.liveMeetingAt ? new Date(lesson.liveMeetingAt).toISOString().slice(0, 16) : "",
        status: lesson.status || "SCHEDULED"
    });

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await api.patch(`/admin/lessons/${lesson.id}`, {
                ...formData,
                liveMeetingAt: formData.liveMeetingAt || null,
                youtubeVideoId: formData.youtubeVideoId || null,
                liveMeetingUrl: formData.liveMeetingUrl || null
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
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Edit Lesson</DialogTitle>
                    <DialogDescription>
                        Update lesson details, live link, or add YouTube recording.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                            id="edit-title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-desc">Description</Label>
                        <Textarea
                            id="edit-desc"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <select
                            id="edit-status"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="LIVE">Live</option>
                            <option value="RECORDED">Recorded</option>
                            <option value="PUBLISHED">Published</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-liveLink">Live Class Link</Label>
                        <Input
                            id="edit-liveLink"
                            placeholder="https://meet.google.com/..."
                            value={formData.liveMeetingUrl}
                            onChange={(e) => setFormData({ ...formData, liveMeetingUrl: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Clear after live session ends</p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-scheduledAt">Scheduled Date & Time</Label>
                        <Input
                            id="edit-scheduledAt"
                            type="datetime-local"
                            value={formData.liveMeetingAt}
                            onChange={(e) => setFormData({ ...formData, liveMeetingAt: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-videoId">YouTube Video ID</Label>
                        <Input
                            id="edit-videoId"
                            placeholder="e.g. dQw4w9WgXcQ"
                            value={formData.youtubeVideoId}
                            onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Add after uploading recording to YouTube (unlisted)</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleUpdate} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ========== EDIT COURSE DIALOG ==========
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
