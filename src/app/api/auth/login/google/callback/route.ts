import { cookies } from "next/headers";
import { google } from "@/lib/server/auth/google";
import { OAuth2RequestError, ArcticFetchError, decodeIdToken } from "arctic";
import { prisma } from "@/lib/server/db";
import { createSession, generateSessionToken } from "@/lib/server/auth/session";
import { setSessionTokenCookie } from "@/lib/server/auth/cookies";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

    if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
        return new Response("Invalid state or code", { status: 400 });
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, codeVerifier);

        const idToken = tokens.idToken();
        const claims = decodeIdToken(idToken);

        const userinfoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: { Authorization: `Bearer ${tokens.accessToken()}` },
        });
        const googleUser: GoogleUser = await userinfoRes.json();

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId: googleUser.sub },
                    { email: googleUser.email },
                ],
            },
        });

        let user;
        if (existingUser) {
            user = existingUser;
        } else {
            user = await prisma.user.create({
                data: {
                    googleId: googleUser.sub,
                    name: googleUser.name,
                    email: googleUser.email,
                    picture: googleUser.picture,
                    emailVerified: googleUser.email_verified,
                },
            });
        }

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id);
        await setSessionTokenCookie(sessionToken, session.expiresAt);

        return new Response(null, {
            status: 302,
            headers: { Location: "/dashboard" },
        });
    } catch (e) {
        console.error("Google OAuth error:", e);

        if (e instanceof OAuth2RequestError) {
            return new Response(e.description, { status: 400 });
        }
        if (e instanceof ArcticFetchError) {
            return new Response(e.message, { status: 400 });
        }

        return new Response("Internal Server Error", { status: 500 });
    }
}

interface GoogleUser {
    sub: string;
    name: string;
    email: string;
    picture: string;
    email_verified: boolean;
}
