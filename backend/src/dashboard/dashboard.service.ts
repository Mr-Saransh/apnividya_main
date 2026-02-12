import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats(userId: string) {
        // Fetch user with streak
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                streak: true,
                enrollments: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                thumbnail: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        enrollments: true,
                        posts: true,
                        comments: true,
                    },
                },
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Calculate global rank based on karma points
        const usersWithHigherKarma = await this.prisma.user.count({
            where: {
                karmaPoints: {
                    gt: user.karmaPoints,
                },
            },
        });

        // Inflate rank to make platform appear more established
        // Multiply by 100 and add virtual base users
        const actualRank = usersWithHigherKarma + 1;
        const inflatedRank = actualRank * 100; // Make it seem like 100x more users
        const virtualTotalUsers = 10000; // Virtual user base for percentage calculation

        // Calculate percentage (e.g., Top 15% instead of Top 0.5%)
        const percentile = Math.min(99, Math.max(1, Math.round((inflatedRank / virtualTotalUsers) * 100)));

        // Calculate lessons completed (approximate from enrollments)
        const lessonsCompleted = user.enrollments.reduce(
            (sum, enrollment) => sum + Math.floor((enrollment.progress / 100) * 10), // Assuming ~10 lessons per course
            0,
        );

        // Get recent enrollments for "Continue Learning"
        // Show uncompleted courses, including new ones (progress 0)
        // We reverse to approximate "most recent" if default order is chronological
        const continueLearningSections = [...user.enrollments]
            .reverse() // innovative way to get recent if inserted last
            .filter((e) => e.progress < 100)
            .slice(0, 2)
            .map((enrollment) => ({
                courseId: enrollment.course.id,
                title: enrollment.course.title,
                thumbnail: enrollment.course.thumbnail,
                progress: enrollment.progress,
            }));

        // Calculate achievement badges
        const achievements = this.calculateAchievements(
            user.karmaPoints,
            user._count.enrollments,
            user._count.posts,
            user._count.comments,
            user.createdAt,
        );

        return {
            karmaPoints: user.karmaPoints,
            globalRank: inflatedRank,
            percentile, // Top X%
            dayStreak: user.streak?.currentStreak || 0,
            lessonsCompleted,
            lessonsThisWeek: Math.floor(lessonsCompleted * 0.25), // Approximate
            totalEnrollments: user._count.enrollments,
            totalPosts: user._count.posts,
            totalComments: user._count.comments,
            continueLearning: continueLearningSections,
            achievements,
        };
    }

    private calculateAchievements(
        karma: number,
        enrollments: number,
        posts: number,
        comments: number,
        joinDate: Date,
    ) {
        const achievements: Array<{ id: number; name: string; icon: string; color: string }> = [];

        // Karma-based
        if (karma >= 100) achievements.push({ id: 1, name: 'First 100', icon: 'trophy', color: 'yellow' });
        if (karma >= 500) achievements.push({ id: 2, name: 'Karma Master', icon: 'star', color: 'purple' });
        if (karma >= 1000) achievements.push({ id: 3, name: 'Legend', icon: 'crown', color: 'gold' });

        // Engagement-based
        if (enrollments >= 3) achievements.push({ id: 4, name: 'Active Learner', icon: 'book', color: 'blue' });
        if (posts >= 5) achievements.push({ id: 5, name: 'Questioner', icon: 'help', color: 'green' });
        if (comments >= 10) achievements.push({ id: 6, name: 'Helper', icon: 'heart', color: 'red' });

        // Time-based
        const daysSinceJoin = Math.floor(
            (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysSinceJoin >= 30) achievements.push({ id: 7, name: 'One Month', icon: 'calendar', color: 'teal' });

        return achievements.slice(0, 8); // Return max 8 achievements
    }

    async getDailyChallenge(userId: string) {
        // Check if user has completed today's challenge
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // For now, return a mock challenge - in production, this would fetch from a challenges table
        return {
            title: 'Daily Knowledge Check',
            description: 'Complete 5 practice questions',
            totalQuestions: 5,
            completed: 0, // Would track actual completion
            progress: 0,
        };
    }
}
