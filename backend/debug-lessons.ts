import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const lessons = await prisma.lesson.findMany({
        select: { id: true, title: true, youtubeVideoId: true, status: true }
    });
    console.log(JSON.stringify(lessons, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
