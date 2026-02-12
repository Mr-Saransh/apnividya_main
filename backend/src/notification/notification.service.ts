import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) { }

    async createNotification(
        userId: string,
        type: NotificationType,
        title: string,
        message: string,
        link?: string,
    ) {
        return this.prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                link,
            },
        });
    }

    async getUserNotifications(userId: string, unreadOnly = false) {
        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly && { read: false }),
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        });
    }

    async markAsRead(notificationId: string, userId: string) {
        return this.prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                read: true,
            },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: {
                read: true,
            },
        });
    }

    async getUnreadCount(userId: string) {
        return this.prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }

    // Notify students about live sessions
    async notifyLiveSession(liveSessionId: string) {
        const liveSession = await this.prisma.liveSession.findUnique({
            where: { id: liveSessionId },
            include: {
                course: {
                    include: {
                        enrollments: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!liveSession) return;

        // Create notifications for all enrolled students
        const notifications = liveSession.course.enrollments.map((enrollment) => ({
            userId: enrollment.userId,
            type: 'LIVE_SESSION' as NotificationType,
            title: `Live Session: ${liveSession.title}`,
            message: `A live session for "${liveSession.course.title}" is scheduled at ${new Date(
                liveSession.scheduledAt,
            ).toLocaleString()}`,
            link: liveSession.meetingLink || `/dashboard/courses/${liveSession.courseId}`,
        }));

        return this.prisma.notification.createMany({
            data: notifications,
        });
    }
}
