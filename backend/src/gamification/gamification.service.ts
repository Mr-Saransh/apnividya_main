import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
    constructor(private prisma: PrismaService) { }

    async awardKarma(userId: string, amount: number, reason: string) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Log to ledger
            await tx.karmaLedger.create({
                data: { userId, amount, reason },
            });

            // 2. Update user points
            return tx.user.update({
                where: { id: userId },
                data: {
                    karmaPoints: { increment: amount },
                },
            });
        });
    }

    async updateStreak(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const streak = await this.prisma.streak.findUnique({
            where: { userId },
        });

        if (!streak) {
            return this.prisma.streak.create({
                data: { userId, currentStreak: 1, lastActivityDate: new Date() },
            });
        }

        const lastActivity = new Date(streak.lastActivityDate);
        lastActivity.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - lastActivity.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);

        if (diffDays === 1) {
            // Consecutive day
            return this.prisma.streak.update({
                where: { userId },
                data: {
                    currentStreak: { increment: 1 },
                    lastActivityDate: new Date(),
                },
            });
        } else if (diffDays > 1) {
            // Streak broken
            return this.prisma.streak.update({
                where: { userId },
                data: {
                    currentStreak: 1,
                    lastActivityDate: new Date(),
                },
            });
        }

        return streak; // Already updated today
    }
}
