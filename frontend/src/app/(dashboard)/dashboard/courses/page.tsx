"use client";

import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, Users, Star, PlayCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

function CoursesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchQuery = searchParams.get("search") || "";

    const [courses, setCourses] = useState<any[]>([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState<string | null>(null);

    // Filtered courses based on search
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        router.push(`/dashboard/courses?${params.toString()}`);
    };

    const fetchCourses = async () => {
        try {
            // Fetch courses and enrolled courses in parallel
            const [coursesResponse, enrolledResponse] = await Promise.all([
                api.get("/courses"),
                api.get("/courses/enrolled")
            ]);
            setCourses(coursesResponse.data);
            setEnrolledCourseIds(new Set(enrolledResponse.data.map((c: any) => c.id)));
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnroll = async (courseId: string) => {
        try {
            setEnrollingId(courseId);
            await api.post(`/courses/${courseId}/enroll`);

            // Optimistic update
            const newEnrolled = new Set(enrolledCourseIds);
            newEnrolled.add(courseId);
            setEnrolledCourseIds(newEnrolled);

            // Also refresh data to be sure
            fetchCourses();
        } catch (error) {
            console.error("Failed to enroll:", error);
        } finally {
            setEnrollingId(null);
        }
    };

    const handleBuy = async (course: any) => {
        if (enrolledCourseIds.has(course.id)) return;

        // If free, just enroll
        if (!course.price || course.price === 0) {
            handleEnroll(course.id);
            return;
        }

        setEnrollingId(course.id);

        try {
            // 1. Create Order
            const orderRes = await api.post('/payment/create-order', { courseId: course.id });
            const order = orderRes.data;

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Apni Vidya",
                description: course.title,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        await api.post('/payment/verify', {
                            courseId: course.id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // Success
                        const newEnrolled = new Set(enrolledCourseIds);
                        newEnrolled.add(course.id);
                        setEnrolledCourseIds(newEnrolled);
                        fetchCourses();
                        alert("Enrolled successfully!");
                    } catch (verifyError) {
                        console.error("Verification failed", verifyError);
                        alert("Payment verification failed");
                    }
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert(response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error("Payment failed", error);
            alert("Payment initiation failed");
        } finally {
            setEnrollingId(null);
        }
    };

    useEffect(() => {
        fetchCourses();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchCourses();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Browse Courses</h1>
                    <p className="text-muted-foreground">Find the perfect course to upgrade your skills.</p>
                </div>
                <div className="flex w-full md:w-auto items-center space-x-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search courses..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground border rounded-lg">
                    {courses.length === 0 ? "No courses available yet." : "No courses match your search."}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="flex flex-col overflow-hidden">
                            <Link
                                href={enrolledCourseIds.has(course.id) ? `/dashboard/courses/${course.id}` : "#"}
                                onClick={(e) => {
                                    if (!enrolledCourseIds.has(course.id)) {
                                        e.preventDefault();
                                    }
                                }}
                                className={`block relative aspect-video w-full bg-muted/60 hover:opacity-90 transition-opacity ${!enrolledCourseIds.has(course.id) ? 'cursor-default' : ''}`}
                            >
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        No Preview
                                    </div>
                                )}
                            </Link>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    {enrolledCourseIds.has(course.id) ? (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Enrolled
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-xs">Course</Badge>
                                    )}
                                    <div className="flex items-center text-xs text-yellow-500 font-medium">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        4.5
                                    </div>
                                </div>
                                <Link
                                    href={enrolledCourseIds.has(course.id) ? `/dashboard/courses/${course.id}` : "#"}
                                    onClick={(e) => {
                                        if (!enrolledCourseIds.has(course.id)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className={`hover:underline ${!enrolledCourseIds.has(course.id) ? 'cursor-default hover:no-underline' : ''}`}
                                >
                                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                </Link>
                                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        {course._count?.enrollments || 0} enrolled
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        Self-paced
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                {enrolledCourseIds.has(course.id) ? (
                                    <Link href={`/dashboard/courses/${course.id}`} className="w-full">
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                            <PlayCircle className="mr-2 h-4 w-4" /> Start Learning
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleBuy(course)}
                                        disabled={enrollingId === course.id}
                                    >
                                        {enrollingId === course.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {enrollingId === course.id ? "Processing..." : (course.price > 0 ? `Buy for ₹${course.price}` : "Enroll Now")}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>}>
            <CoursesContent />
        </Suspense>
    );
}
