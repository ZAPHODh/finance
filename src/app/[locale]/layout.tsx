import { siteUrl } from "@/config/site";
import { siteConfig } from "@/config/site-server";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { I18nProviderClient } from "@/locales/client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieConsent } from "@/components/legal/cookie-consent";
import { PosthogProvider } from "@/components/analytics/posthog-provider";
import { CommandMenuProvider } from "@/components/command-menu-provider";
import { QueryProvider } from "@/components/query-provider";
import { cn } from "@/lib/utils";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AccessibilityProvider } from "@/components/accessibility-provider";
import { ThemeSyncScript } from "@/components/theme-sync-script";
import { getCurrentSession } from "@/lib/server/auth/session";
import { prisma } from "@/lib/server/db";

import "../globals.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const locale = p.locale;
  const site = await siteConfig(locale);

  const siteOgImage = `${siteUrl}/api/og?locale=${locale}`;

  return {
    title: {
      default: site.name,
      template: `%s - ${site.name}`,
    },
    description: site.description,
    keywords: [
      "Next.js",
      "Shadcn/ui",
      "LuciaAuth",
      "Prisma",
      "Vercel",
      "Tailwind",
      "Radix UI",
      "Stripe",
      "Internationalization",
      "Postgres",
    ],
    authors: [
      {
        name: "Luis Paulo",
        url: "",
      },
    ],
    creator: "Zaphodh",
    openGraph: {
      type: "website",
      locale: locale,
      url: site.url,
      title: site.name,
      description: site.description,
      siteName: site.name,
      images: [
        {
          url: siteOgImage,
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      images: [siteOgImage],
      creator: "@zaphodh",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${siteUrl}/manifest.json`,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        pt: "/pt",
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: site.name,
    },
  };
}

export const viewport = {
  width: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDyslexic = Inter({
  subsets: ["latin"],
  variable: "--font-dyslexic",
});


export default async function RootLayout({
  children,
  loginDialog,
  params,
}: {
  children: React.ReactNode;
  loginDialog: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { user } = await getCurrentSession();
  let userTheme = "dark";

  if (user) {
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
      select: { theme: true },
    });
    userTheme = preferences?.theme || "dark";
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeSyncScript theme={userTheme} />
      </head>
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontDyslexic.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={userTheme}
          enableSystem={userTheme === "system"}
        >
          <AccessibilityProvider initialTheme={userTheme}>
            <PosthogProvider>
              <QueryProvider>
                <I18nProviderClient locale={locale}>
                  <CommandMenuProvider>
                    <NuqsAdapter>
                      <main>
                        {children}
                        {loginDialog}
                      </main>
                    </NuqsAdapter>
                  </CommandMenuProvider>
                </I18nProviderClient>
                <Toaster />
                <CookieConsent />
              </QueryProvider>
            </PosthogProvider>
          </AccessibilityProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}