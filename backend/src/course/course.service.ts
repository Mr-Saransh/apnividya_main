import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const courses = await this.prisma.course.findMany({
            include: {
                _count: {
                    select: { enrollments: true },
                },
            },
        });

        // Inflate counts to make platform look active
        return courses.map(course => ({
            ...course,
            _count: {
                enrollments: 50 + (course._count.enrollments * 5)
            }
        }));
    }

    async findOne(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                lessons: {
                    orderBy: { order: 'asc' },
                },
                instructor: {
                    select: { fullName: true, bio: true }
                }
            },
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return course;
    }

    async getEnrolledCourses(userId: string) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        thumbnail: true,
                        level: true,
                        category: true,
                    },
                },
            },
        });

        // Return just the course data
        return enrollments.map((enrollment) => enrollment.course);
    }

    async enroll(userId: string, courseId: string) {
        // Check if course exists
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) throw new NotFoundException("Course not found");

        // Check if already enrolled
        const existingEnrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        if (existingEnrollment) return existingEnrollment;

        // Create enrollment
        const enrollment = await this.prisma.enrollment.create({
            data: {
                userId,
                courseId,
                progress: 0
            }
        });

        // Award Karma for enrolling (first step)
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: { karmaPoints: { increment: 50 } }
            });
        } catch (error) {
            console.error("Failed to aware karma:", error);
        }

        return enrollment;
    }
}
