import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { MockTestService } from './mock-test.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Mock Tests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mock-test')
export class MockTestController {
    constructor(private readonly mockTestService: MockTestService) { }

    @Post('generate')
    @ApiOperation({ summary: 'Generate a new AI mock test for a course' })
    generate(@Req() req: any, @Body('courseId') courseId: string) {
        return this.mockTestService.generateTest(req.user.userId, courseId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all mock tests for the current user' })
    findAll(@Req() req: any) {
        return this.mockTestService.getTests(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get details of a specific mock test' })
    findOne(@Param('id') id: string) {
        return this.mockTestService.getTest(id);
    }

    @Post('answer')
    @ApiOperation({ summary: 'Submit an answer for a question' })
    submitAnswer(@Body('questionId') questionId: string, @Body('answerIndex') answerIndex: number) {
        return this.mockTestService.submitAnswer(questionId, answerIndex);
    }

    @Post(':id/finish')
    @ApiOperation({ summary: 'Mark a test as completed' })
    finish(@Param('id') id: string) {
        return this.mockTestService.finishTest(id);
    }
}
