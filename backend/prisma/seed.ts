import { PrismaClient, Role, ContentType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.karmaLedger.deleteMany({});
    await prisma.mockQuestion.deleteMany({});
    await prisma.mockTest.deleteMany({});
    await prisma.quizAttempt.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.postVote.deleteMany({});
    await prisma.communityPost.deleteMany({});
    await prisma.notification.deleteMany({});

    await prisma.tutorMessage.deleteMany({});
    await prisma.tutorChat.deleteMany({});

    await prisma.payment.deleteMany({});
    await prisma.teacherSubmission.deleteMany({});
    await prisma.teacherToken.deleteMany({});
    await prisma.lessonCompletion.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.courseDocument.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.user.deleteMany({});

    // Create an Educator
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('password123', salt);

    const educator = await prisma.user.create({
        data: {
            email: 'hcverma@example.com',
            fullName: 'Dr. HC Verma',
            passwordHash,
            role: Role.EDUCATOR,
            bio: 'Renowned Physicist and Author of Concepts of Physics.',
            karmaPoints: 1000,
        },
    });

    // Create an Admin
    const adminPassword = await bcrypt.hash('admin123', salt);
    await prisma.user.create({
        data: {
            email: 'admin@apnividya.com',
            fullName: 'System Admin',
            passwordHash: adminPassword,
            role: Role.ADMIN,
            bio: 'Super User',
            karmaPoints: 9999,
        },
    });

    // Create a Course
    const course = await prisma.course.create({
        data: {
            title: 'Physics: Mechanics Mastery',
            description: 'Master Newton\'s laws, kinematics, and dynamics with visual simulations.',
            instructorId: educator.id,
            published: true,
            thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1000&auto=format&fit=crop',
        },
    });

    // Create Premium Upgrade Course
    await prisma.course.create({
        data: {
            title: 'Premium Upgrade',
            description: 'Unlock all features and premium access.',
            instructorId: educator.id,
            published: true,
            price: 150,
            thumbnail: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop',
            category: 'Subscription'
        },
    });

    // Create Lessons
    const lessons = [
        {
            title: 'Introduction to Motion',
            description: 'Understanding displacement, velocity, and acceleration.',
            youtubeVideoId: 'dQw4w9WgXcQ',
            order: 1,
            courseId: course.id,
            type: ContentType.VIDEO,
            duration: 720,
        },
        {
            title: 'Newton\'s First Law',
            description: 'The law of inertia explained.',
            youtubeVideoId: 'dQw4w9WgXcQ',
            order: 2,
            courseId: course.id,
            type: ContentType.VIDEO,
            duration: 900,
        },
        {
            title: 'Projectile Motion',
            description: 'Calculating trajectory and range.',
            youtubeVideoId: 'dQw4w9WgXcQ',
            order: 3,
            courseId: course.id,
            type: ContentType.VIDEO,
            duration: 1500,
        },
    ];

    for (const lesson of lessons) {
        await prisma.lesson.create({ data: lesson });
    }

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
