import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { CourseService } from './course.service';
import { GamificationService } from '../gamification/gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonController {
    constructor(
        private prisma: PrismaService,
        private gamification: GamificationService
    ) { }

    @Post(':id/complete')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mark a lesson as completed and earn Karma' })
    async complete(@Param('id') id: string, @Request() req) {
        const userId = req.user.id;

        // 1. Check if already completed
        const existing = await this.prisma.lessonCompletion.findUnique({
            where: { userId_lessonId: { userId, lessonId: id } },
        });

        if (existing) return { message: 'Already completed' };

        // 2. Create completion
        await this.prisma.lessonCompletion.create({
            data: { userId, lessonId: id },
        });

        // 3. Award Karma (e.g., 50 points per lesson)
        await this.gamification.awardKarma(userId, 50, 'Lesson Completion');

        // 4. Update Streak
        await this.gamification.updateStreak(userId);

        return { message: 'Lesson completed', karmaAwarded: 50 };
    }
}
