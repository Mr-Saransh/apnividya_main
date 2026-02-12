import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const lessons = await prisma.lesson.findMany({
        select: { id: true, title: true, youtubeVideoId: true, status: true }
    });
    fs.writeFileSync('lessons-dump.json', JSON.stringify(lessons, null, 2));
    console.log('Dumped to lessons-dump.json');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
