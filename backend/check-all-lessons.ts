import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        include: {
            lessons: { // Fixed: using existing 'lessons' relation
                select: { id: true, title: true, youtubeVideoId: true, status: true }
            }
        }
    });
    console.log(JSON.stringify(courses, null, 2));
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
