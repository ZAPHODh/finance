import { revalidatePath } from "next/cache";
import { verifyVerificationCode } from "@/lib/server/auth";
import { setSessionTokenCookie } from "@/lib/server/auth/cookies";
import {
    createSession,
    generateSessionToken,
    invalidateAllSessions,
} from "@/lib/server/auth/session";
import { prisma } from "@/lib/server/db";
import { rateLimitByEmail, rateLimitByIP, checkMultipleRateLimits, createRateLimitResponse, trackFailedAttempts, resetFailedAttempts } from "@/lib/server/rate-limit";

function getClientIP(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    const realIP = req.headers.get("x-real-ip");

    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return "unknown";
}

export const POST = async (req: Request) => {
    const body = await req.json();
    const email = body.email?.toLowerCase()?.trim();

    if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const clientIP = getClientIP(req);

    const failedAttempts = await trackFailedAttempts(email, 10, 3600);
    if (failedAttempts.locked) {
        return new Response(
            JSON.stringify({
                error: "Account temporarily locked due to too many failed attempts. Please try again later.",
                attemptsRemaining: 0,
            }),
            {
                status: 429,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const rateLimitResult = await checkMultipleRateLimits([
        () => rateLimitByEmail(email, 5, "15 m"),
        () => rateLimitByIP(clientIP, 10, "1 h"),
    ]);

    if (!rateLimitResult.success) {
        console.warn(`Rate limit exceeded for verify-otp: email=${email}, ip=${clientIP}`);
        return createRateLimitResponse(
            "Too many verification attempts. Please try again later.",
            rateLimitResult
        );
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                emailVerified: true,
            },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const isValid = await verifyVerificationCode(
            { id: user.id, email: user.email! },
            body.code
        );

        if (!isValid) {
            const attemptsRemaining = 10 - failedAttempts.attempts;
            console.warn(`Failed OTP verification attempt for ${email}. Attempts: ${failedAttempts.attempts}/10`);

            return new Response(
                JSON.stringify({
                    error: "Invalid OTP",
                    attemptsRemaining: Math.max(0, attemptsRemaining),
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        await resetFailedAttempts(email);

        await invalidateAllSessions(user.id);

        if (!user.emailVerified) {
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    emailVerified: true,
                },
            });
        }
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id);
        await setSessionTokenCookie(sessionToken, session.expiresAt);
        revalidatePath("/", "layout");
        return new Response(null, {
            status: 200,
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};