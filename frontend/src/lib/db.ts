import { PrismaClient } from '../generated/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

declare global {
    var prisma: PrismaClientSingleton | undefined
}

export const db = globalThis.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
