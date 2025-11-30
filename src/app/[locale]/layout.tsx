import { siteUrl } from "@/config/site";
import { siteConfig } from "@/config/site-server";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { headers } from "next/headers";
import { I18nProviderClient } from "@/locales/client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieConsent } from "@/components/legal/cookie-consent";
import { PosthogProvider } from "@/components/analytics/posthog-provider";
import { CommandMenuProvider } from "@/components/command-menu-provider";
import { QueryProvider } from "@/components/query-provider";
import { cn } from "@/lib/utils";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "../globals.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
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


  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
        </ThemeProvider>
      </body>
    </html>
  );
}