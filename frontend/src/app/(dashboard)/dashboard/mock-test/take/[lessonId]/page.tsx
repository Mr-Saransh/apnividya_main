
"use client";

import { use } from "react";
import { MockTestTab } from "@/components/player/mock-test-tab";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TakeMockTestPage({ params }: { params: Promise<{ lessonId: string }> }) {
    const { lessonId } = use(params);
    const router = useRouter();

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
            </div>

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mock Test</h1>
                    <p className="text-muted-foreground mt-2">Complete the test below to assess your understanding.</p>
                </div>

                <MockTestTab lessonId={lessonId} />
            </div>
        </div>
    );
}
