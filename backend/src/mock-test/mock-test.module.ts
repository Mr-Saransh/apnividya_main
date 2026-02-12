import { Module } from '@nestjs/common';
import { MockTestService } from './mock-test.service';
import { MockTestController } from './mock-test.controller';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MockTestService],
  controllers: [MockTestController]
})

export class MockTestModule { }
