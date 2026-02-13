import { PrismaClient } from '../generated/client'

console.log("[DB] Initializing Prisma Client from ../generated/client");

const prismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

declare global {
    var prisma: PrismaClientSingleton | undefined
}

// Force reset if the existing client is missing new models or has old ones
if (globalThis.prisma) {
    const models = Object.keys(globalThis.prisma).filter(k => !k.startsWith('$'));
    console.log("[DB] Available models:", models);
    const hasOldModels = models.includes('mockTest') || models.includes('mockTestAttempt');
    const missingNewModels = !models.includes('lessonQuiz');

    if (hasOldModels || missingNewModels) {
        console.log("Outdated Prisma client detected, resetting...");
        globalThis.prisma = undefined;
    }
}

export const db = globalThis.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
