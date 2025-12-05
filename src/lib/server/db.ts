import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
    // biome-ignore lint/style/noVar: This is required for global Prisma instance
    var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DB_PRISMA_URL;

function createPrismaClient() {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };