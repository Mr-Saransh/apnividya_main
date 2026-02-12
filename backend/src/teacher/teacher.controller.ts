import { Controller, Post, Body, Get, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('teacher')
export class TeacherController {
    constructor(private prisma: PrismaService) { }

    @Get('validate')
    async validateToken(@Query('token') token: string) {
        if (!token) throw new BadRequestException('Token required');

        const teacherToken = await this.prisma.teacherToken.findUnique({
            where: { token },
            include: { lesson: { include: { course: true } } }
        });

        if (!teacherToken) throw new NotFoundException('Invalid token');
        if (teacherToken.used) throw new BadRequestException('Token already used');
        if (teacherToken.expiresAt < new Date()) throw new BadRequestException('Token expired');

        return {
            valid: true,
            data: {
                lessonTitle: teacherToken.lesson.title,
                courseTitle: teacherToken.lesson.course.title,
                lessonStatus: teacherToken.lesson.status
            }
        };
    }

    @Post('submit')
    async submitVideo(@Body() body: { token: string; link: string; notes?: string }) {
        const { token, link, notes } = body;

        const teacherToken = await this.prisma.teacherToken.findUnique({
            where: { token },
            include: { lesson: true }
        });

        if (!teacherToken) throw new NotFoundException('Invalid token');
        if (teacherToken.used) throw new BadRequestException('Token already used');
        if (teacherToken.expiresAt < new Date()) throw new BadRequestException('Token expired');

        // Create submission
        await this.prisma.teacherSubmission.create({
            data: {
                lessonId: teacherToken.lessonId,
                submittedLink: link,
                notes,
                status: 'PENDING_REVIEW'
            }
        });

        // Mark token as used
        await this.prisma.teacherToken.update({
            where: { id: teacherToken.id },
            data: { used: true }
        });

        return { success: true };
    }
}
