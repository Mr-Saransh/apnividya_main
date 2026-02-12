import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CourseModule } from './course/course.module';
import { RagModule } from './rag/rag.module';
import { GamificationModule } from './gamification/gamification.module';
import { MockTestModule } from './mock-test/mock-test.module';
import { TutorModule } from './tutor/tutor.module';
import { AdminModule } from './admin/admin.module';
import { TeacherModule } from './teacher/teacher.module';
import { CommunityModule } from './community/community.module';
import { NotificationModule } from './notification/notification.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    CourseModule,
    RagModule,
    GamificationModule,
    MockTestModule,
    TutorModule,
    AdminModule,
    TeacherModule,
    CommunityModule,
    NotificationModule,
    NotificationModule,
    DashboardModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
