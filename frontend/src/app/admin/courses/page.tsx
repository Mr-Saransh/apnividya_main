"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Book, Eye, EyeOff, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/admin/courses');
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (courseId: string) => {
        if (!confirm("Are you sure you want to delete this course? This action cannot be undone and will delete all lessons, enrollments, and related data.")) {
            return;
        }

        try {
            await api.delete(`/admin/courses/${courseId}`);
            setCourses(courses.filter(c => c.id !== courseId));
        } catch (error) {
            console.error("Failed to delete course", error);
            alert("Failed to delete course. Please try again.");
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
                    <p className="text-muted-foreground">Manage your curriculum and content.</p>
                </div>
                <Link href="/admin/courses/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Course
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <Card key={course.id} className="hover:bg-muted/5 transition-colors">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium line-clamp-1">
                                {course.title}
                            </CardTitle>
                            {course.published ? (
                                <Badge className="bg-green-600">Published</Badge>
                            ) : (
                                <Badge variant="secondary">Draft</Badge>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                                {course.description}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                    {course._count?.lessons || 0} Lessons
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(course.id)}
                                        title="Delete Course"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Link href={`/admin/courses/${course.id}/lessons`}>
                                        <Button variant="outline" size="sm">
                                            Manage
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                        <Book className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-semibold">No courses yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first course to get started.</p>
                        <Link href="/admin/courses/new">
                            <Button>Create Course</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div >
    );
}
