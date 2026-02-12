import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser(req);
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const [lessonsCompleted, streak, usersWithMoreKarma, totalUsers] = await Promise.all([
            db.lessonCompletion.count({ where: { userId: user.id } }),
            db.streak.findUnique({ where: { userId: user.id } }),
            db.user.count({ where: { karmaPoints: { gt: user.karmaPoints } } }),
            db.user.count()
        ]);

        const globalRank = usersWithMoreKarma + 1;
        const percentile = totalUsers > 0 ? Math.round(((totalUsers - globalRank + 1) / totalUsers) * 100) : 100;

        const continueLearningEnrollments = await db.enrollment.findMany({
            where: { userId: user.id, progress: { lt: 100 } },
            include: { course: true },
            take: 3,
            orderBy: { enrolledAt: "desc" }
        });

        const data = {
            karmaPoints: user.karmaPoints,
            globalRank,
            percentile,
            dayStreak: streak?.currentStreak || 0,
            lessonsCompleted,
            lessonsThisWeek: 0,
            continueLearning: continueLearningEnrollments.map((e: any) => ({
                courseId: e.courseId,
                title: e.course.title,
                thumbnail: e.course.thumbnail,
                progress: e.progress
            })),
            achievements: []
        };

        return NextResponse.json(data);
    } catch (error) {
        console.log("[DASHBOARD_STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
