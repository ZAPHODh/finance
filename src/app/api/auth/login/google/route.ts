import { cookies } from "next/headers";
import { google } from "@/lib/server/auth/google";
import { generateState, generateCodeVerifier } from "arctic";

export async function GET() {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const scopes = ["openid", "profile", "email"];
    const url = google.createAuthorizationURL(state, codeVerifier, scopes);

    url.searchParams.set("access_type", "offline");

    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        sameSite: "lax",
    });
    cookieStore.set("google_code_verifier", codeVerifier, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        sameSite: "lax",
    });

    return Response.redirect(url.toString());
}
