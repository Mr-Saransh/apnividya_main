import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException, Param, Patch, Delete } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private prisma: PrismaService) { }

    private checkAdmin(user: any) {
        if (user.role !== Role.ADMIN) {
            throw new UnauthorizedException('Admin access required');
        }
    }

    @Get('courses')
    async getCourses(@Req() req) {
        this.checkAdmin(req.user);
        // Fetch all courses, even unpublished ones
        return this.prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { lessons: true }
                }
            }
        });
    }

    @Post('courses')
    async createCourse(@Req() req, @Body() body: { title: string; description: string; level: string; language: string; thumbnailUrl: string; published: boolean }) {
        this.checkAdmin(req.user);
        const { thumbnailUrl, ...rest } = body;
        return this.prisma.course.create({
            data: {
                ...rest,
                thumbnail: thumbnailUrl,
                instructorId: req.user.sub,
            }
        });
    }

    @Get('courses/:id')
    async getCourse(@Req() req, @Param('id') id: string) {
        this.checkAdmin(req.user);
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                lessons: {
                    orderBy: { order: 'asc' },
                    include: {
                        tokens: true
                    }
                }
            }
        });

        // Map thumbnail to thumbnailUrl for frontend consistency
        if (course) {
            return {
                ...course,
                thumbnailUrl: course.thumbnail
            };
        }
        return null;
    }

    @Post('courses/:id/lessons')
    async createLesson(@Req() req, @Param('id') courseId: string, @Body() body: { title: string; description: string; order: number }) {
        this.checkAdmin(req.user);
        return this.prisma.lesson.create({
            data: {
                courseId,
                title: body.title,
                description: body.description,
                order: body.order,
                status: 'WAITING_FOR_VIDEO'
            }
        });
    }

    @Post('lessons/:id/token')
    async generateToken(@Req() req, @Param('id') lessonId: string) {
        this.checkAdmin(req.user);
        const token = uuidv4();
        // Expires in 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        return this.prisma.teacherToken.create({
            data: {
                token,
                lessonId,
                expiresAt
            }
        });
    }

    @Get('submissions')
    async getSubmissions(@Req() req) {
        this.checkAdmin(req.user);
        return this.prisma.teacherSubmission.findMany({
            where: { status: 'PENDING_REVIEW' },
            include: { lesson: { include: { course: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    @Patch('lessons/:id/publish')
    async publishLesson(@Req() req, @Param('id') lessonId: string, @Body() body: { youtubeVideoId: string }) {
        this.checkAdmin(req.user);

        // Update the lesson
        const lesson = await this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                youtubeVideoId: body.youtubeVideoId,
                status: 'PUBLISHED'
            }
        });

        // Mark all pending submissions for this lesson as APPROVED
        await this.prisma.teacherSubmission.updateMany({
            where: { lessonId, status: 'PENDING_REVIEW' },
            data: { status: 'APPROVED' }
        });
    }

    @Patch('lessons/:id')
    async updateLesson(
        @Req() req,
        @Param('id') lessonId: string,
        @Body() body: {
            title?: string;
            description?: string;
            youtubeVideoId?: string;
            liveMeetingUrl?: string;
            liveMeetingAt?: string;
            status?: any;
        }
    ) {
        this.checkAdmin(req.user);

        return this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                title: body.title,
                description: body.description,
                youtubeVideoId: body.youtubeVideoId,
                liveMeetingUrl: body.liveMeetingUrl,
                liveMeetingAt: body.liveMeetingAt ? new Date(body.liveMeetingAt) : undefined,
                status: body.status // Optional status update
            }
        });
    }

    @Patch('courses/:id')
    async updateCourse(
        @Req() req,
        @Param('id') id: string,
        @Body() body: {
            title?: string;
            description?: string;
            price?: number;
            published?: boolean;
            thumbnailUrl?: string;
            level?: string;
            language?: string;
            category?: string;
        }
    ) {
        this.checkAdmin(req.user);
        const { thumbnailUrl, ...rest } = body;

        const updateData: any = { ...rest };
        if (thumbnailUrl !== undefined) {
            updateData.thumbnail = thumbnailUrl;
        }

        return this.prisma.course.update({
            where: { id },
            data: updateData
        });
    }

    @Delete('courses/:id')
    async deleteCourse(@Req() req, @Param('id') id: string) {
        this.checkAdmin(req.user);

        // Delete entire course and dependencies in transaction
        return this.prisma.$transaction(async (tx) => {
            // 1. Delete Dependencies first
            await tx.payment.deleteMany({ where: { courseId: id } });
            await tx.enrollment.deleteMany({ where: { courseId: id } });
            await tx.courseDocument.deleteMany({ where: { courseId: id } });
            await tx.liveSession.deleteMany({ where: { courseId: id } });

            // 2. Handle Lessons
            const lessons = await tx.lesson.findMany({ where: { courseId: id } });
            for (const lesson of lessons) {
                await tx.lessonCompletion.deleteMany({ where: { lessonId: lesson.id } });
                await tx.teacherSubmission.deleteMany({ where: { lessonId: lesson.id } });
                await tx.teacherToken.deleteMany({ where: { lessonId: lesson.id } });
                await tx.quizAttempt.deleteMany({ where: { lessonId: lesson.id } });
            }
            await tx.lesson.deleteMany({ where: { courseId: id } });

            // 3. Delete Course
            return tx.course.delete({ where: { id } });
        });
    }

    @Delete('lessons/:id')
    async deleteLesson(@Req() req, @Param('id') id: string) {
        this.checkAdmin(req.user);

        return this.prisma.$transaction(async (tx) => {
            // Delete lesson dependencies
            await tx.lessonCompletion.deleteMany({ where: { lessonId: id } });
            await tx.teacherSubmission.deleteMany({ where: { lessonId: id } });
            await tx.teacherToken.deleteMany({ where: { lessonId: id } });
            await tx.quizAttempt.deleteMany({ where: { lessonId: id } });

            // Delete Lesson
            return tx.lesson.delete({ where: { id } });
        });
    }
}
