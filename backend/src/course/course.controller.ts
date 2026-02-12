import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) { }

    @Get()
    @ApiOperation({ summary: 'Get all courses' })
    @ApiResponse({ status: 200, description: 'List of courses.' })
    findAll() {
        return this.courseService.findAll();
    }

    @Get('enrolled')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user\'s enrolled courses' })
    @ApiResponse({ status: 200, description: 'List of enrolled courses.' })
    getEnrolledCourses(@Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        return this.courseService.getEnrolledCourses(userId);
    }

    @Post(':id/enroll')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Enroll in a course' })
    @ApiResponse({ status: 201, description: 'Enrolled successfully.' })
    enroll(@Param('id') id: string, @Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        return this.courseService.enroll(userId, id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a specific course by ID' })
    @ApiResponse({ status: 200, description: 'Course details with modules and lessons.' })
    findOne(@Param('id') id: string) {
        return this.courseService.findOne(id);
    }
}
