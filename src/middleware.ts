import { createI18nMiddleware } from "next-international/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { generateNonce, setCSPHeaders } from "@/lib/csp";

const I18nMiddleware = createI18nMiddleware({
    locales: ["en", "pt"],
    defaultLocale: "pt",
});

export function middleware(request: NextRequest) {
    // Generate nonce for this request
    const nonce = generateNonce();

    // Get the i18n response
    const response = I18nMiddleware(request);

    // Ensure we have a NextResponse to modify
    const nextResponse = response instanceof NextResponse
        ? response
        : NextResponse.next();

    // Set CSP headers with nonce
    const isDevelopment = process.env.NODE_ENV === 'development';
    setCSPHeaders(nextResponse, nonce, isDevelopment);

    return nextResponse;
}

export const config = {
    matcher: [
        "/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
