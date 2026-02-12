import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const courseId = '706b2b19-8761-41c2-9886-3b75224f4a47'; // Physics: Mechanics Mastery
    const lessons = await prisma.lesson.findMany({
        where: { courseId },
        select: { id: true, title: true, youtubeVideoId: true, status: true }
    });
    console.log('Lessons:', JSON.stringify(lessons, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
