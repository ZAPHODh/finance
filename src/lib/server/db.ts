
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const pool = new Pool({
    connectionString: process.env.DB_PRISMA_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
})

const adapter = new PrismaPg(pool)

const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }