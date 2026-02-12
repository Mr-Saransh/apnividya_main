import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TeacherController],
})
export class TeacherModule { }
