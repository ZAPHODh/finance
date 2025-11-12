import { createI18nMiddleware } from "next-international/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { generateNonce, setCSPHeaders } from "@/lib/csp";

const I18nMiddleware = createI18nMiddleware({
    locales: ["en", "pt"],
    defaultLocale: "pt",
});

export function middleware(request: NextRequest) {

    const nonce = generateNonce();

    const response = I18nMiddleware(request);

    const nextResponse = response instanceof NextResponse
        ? response
        : NextResponse.next();

    const isDevelopment = process.env.NODE_ENV === 'development';
    setCSPHeaders(nextResponse, nonce, isDevelopment);

    return nextResponse;
}

export const config = {
    matcher: [
        "/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
