import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
    imports: [PrismaModule, GamificationModule],
    controllers: [CommunityController],
    providers: [CommunityService],
    exports: [CommunityService]
})
export class CommunityModule { }
