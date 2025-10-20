import { generateRandomString, RandomReader } from "@oslojs/crypto/random";
import { createMiddleware } from "next-safe-action";
import { getCurrentSession } from "./session";
import { prisma } from '../db'
const digits = "0123456789";

export async function generateEmailVerificationCode(
    userId: string,
    email: string
): Promise<string> {
    await prisma.emailVerificationCode.deleteMany({
        where: {
            userId,
        },
    });
    const random: RandomReader = {
        read(bytes) {
            crypto.getRandomValues(bytes);
        },
    };
    const code = generateRandomString(random, digits, 6);
    await prisma.emailVerificationCode.create({
        data: {
            userId,
            email,
            code,
            expiresAt: new Date(Date.now() + 1000 * 60 * 3),
        },
    });
    return code;
}

export async function verifyVerificationCode(
    user: { id: string; email: string },
    code: string
): Promise<boolean> {
    return await prisma.$transaction(async (tx) => {
        const databaseCode = await tx.emailVerificationCode.findFirst({
            where: {
                userId: user.id,
            },
        });

        if (!databaseCode || databaseCode.code !== code) {
            return false;
        }

        await tx.emailVerificationCode.delete({
            where: {
                id: databaseCode.id,
            },
        });

        if (Date.now() > databaseCode.expiresAt.getTime()) {
            return false;
        }

        if (databaseCode.email !== user.email) {
            return false;
        }

        return true;
    });
}

export const authMiddleware = createMiddleware().define(async ({ next }) => {
    const { session, user } = await getCurrentSession();
    if (!session) {
        throw new Error("Unauthorized");
    }
    return next({ ctx: { userId: user.id, sessionId: session.id } });
});