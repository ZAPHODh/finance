'use client';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import { Mail } from "lucide-react";
import { useScopedI18n, useCurrentLocale } from "@/locales/client";
import { useSiteConfig } from "@/config/site-client";

export default function ContactPage() {
  const t = useScopedI18n('marketing.contact');
  const locale = useCurrentLocale();
  const config = useSiteConfig(locale);

  return (
    <>
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 md:px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            {t('subtitle')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('contactInfo.title')}</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">{t('contactInfo.supportEmail.title')}</h3>
                  <p className="text-muted-foreground">{config.contact.support.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('contactInfo.supportEmail.description', { responseTime: config.contact.support.responseTime })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">{config.contact.privacy.title}</h3>
                  <p className="text-muted-foreground">{config.contact.privacy.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('contactInfo.privacyEmail.description')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('faqSection.title')}</h2>
            <p className="text-muted-foreground">
              {t('faqSection.description')}{" "}
              <a href="/faq" className="text-primary hover:underline">
                {t('faqSection.link')}
              </a>
              {t('faqSection.suffix')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('bugReport.title')}</h2>
            <p className="text-muted-foreground">
              {t('bugReport.description')}{" "}
              <a href={`mailto:${config.contact.support.email}`} className="text-primary hover:underline">
                {config.contact.support.email}
              </a>{" "}
              {t('bugReport.withDetails')}
            </p>
            <ul className="list-disc pl-6 mt-2 text-muted-foreground">
              <li>{t('bugReport.browser')}</li>
              <li>{t('bugReport.steps')}</li>
              <li>{t('bugReport.screenshots')}</li>
              <li>{t('bugReport.errors')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('feedback.title')}</h2>
            <p className="text-muted-foreground">
              {t('feedback.description')}{" "}
              <a href={`mailto:${config.contact.support.email}`} className="text-primary hover:underline">
                {config.contact.support.email}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
