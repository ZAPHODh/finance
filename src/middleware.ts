import { createI18nMiddleware } from "next-international/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { validateSessionToken } from "@/lib/server/auth/session";

const I18nMiddleware = createI18nMiddleware({
    locales: ["en", "pt"],
    defaultLocale: "pt",
});

export async function middleware(request: NextRequest) {
    // Apply i18n middleware first
    const i18nResponse = I18nMiddleware(request);

    // Get session token from cookies
    const token = request.cookies.get("session")?.value ?? null;

    // Public routes that don't require authentication or onboarding
    const publicPaths = ["/", "/login", "/signup", "/api", "/static"];
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.includes(path));

    // If it's a public path, return i18n response
    if (isPublicPath || !token) {
        return i18nResponse;
    }

    // Validate session and check onboarding status
    const { user } = await validateSessionToken(token);

    if (!user) {
        return i18nResponse;
    }

    const isOnboardingPath = request.nextUrl.pathname.includes("/onboarding");
    const isDashboardPath = request.nextUrl.pathname.includes("/dashboard");
    const isAccountPath = request.nextUrl.pathname.includes("/account") ||
                         request.nextUrl.pathname.includes("/settings") ||
                         request.nextUrl.pathname.includes("/preferences") ||
                         request.nextUrl.pathname.includes("/billing");

    // If user hasn't completed onboarding and is trying to access protected routes
    if (!user.hasCompletedOnboarding && !isOnboardingPath && (isDashboardPath || isAccountPath)) {
        const locale = request.nextUrl.pathname.split('/')[1]; // Extract locale from path
        const onboardingUrl = new URL(`/${locale}/onboarding`, request.url);
        return NextResponse.redirect(onboardingUrl);
    }

    // If user has completed onboarding and is trying to access onboarding page
    if (user.hasCompletedOnboarding && isOnboardingPath) {
        const locale = request.nextUrl.pathname.split('/')[1];
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return i18nResponse;
}

export const config = {
    matcher: [
        "/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
