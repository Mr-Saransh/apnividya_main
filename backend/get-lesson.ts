import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const lesson = await prisma.lesson.findFirst();
    if (lesson) {
        console.log(`LESSON_ID=${lesson.id}`);
    } else {
        console.log('No lessons found');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
