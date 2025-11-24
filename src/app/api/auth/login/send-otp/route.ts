import { generateEmailVerificationCode } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { sendOTP } from "@/lib/server/mail";
import { rateLimitByEmail, rateLimitByIP, checkMultipleRateLimits, createRateLimitResponse } from "@/lib/server/rate-limit";

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

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const POST = async (req: Request) => {
    const body = await req.json();
    const email = body.email?.toLowerCase()?.trim();

    if (!email || !isValidEmail(email)) {
        return new Response(JSON.stringify({ error: "Invalid email address" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const clientIP = getClientIP(req);

    const rateLimitResult = await checkMultipleRateLimits([
        () => rateLimitByEmail(email, 3, "15 m"),
        () => rateLimitByIP(clientIP, 5, "1 h"),
    ]);

    if (!rateLimitResult.success) {
        console.warn(`Rate limit exceeded for send-otp: email=${email}, ip=${clientIP}`);
        return createRateLimitResponse(
            "Too many OTP requests. Please try again later.",
            rateLimitResult
        );
    }

    try {
        const user = await prisma.user.upsert({
            where: {
                email: email,
            },
            update: {
            },
            create: {
                email: email,
                emailVerified: false,
            },
        });

        const otp = await generateEmailVerificationCode(user.id, email);
        await sendOTP({
            toMail: email,
            code: otp,
            userName: user.name?.split(" ")[0] || "",
        });

        return new Response(null, {
            status: 200,
        });
    } catch (error) {
        console.log(error);

        return new Response(null, {
            status: 500,
        });
    }
};