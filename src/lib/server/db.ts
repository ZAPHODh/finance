import { PrismaClient } from "@prisma/client";

declare global {
    // biome-ignore lint/style/noVar: This is required for global Prisma instance
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };