'use client';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import { useScopedI18n, useCurrentLocale } from "@/locales/client";
import { siteConfig } from "@/config/site";

export default function TermsPage() {
  const t = useScopedI18n('marketing.terms');
  const locale = useCurrentLocale();
  const config = siteConfig(locale);
  const currentDate = new Date().toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US');

  return (
    <>
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 md:px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            {t('lastUpdated', { date: currentDate })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section1.title')}</h2>
            <p>{t('section1.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section2.title')}</h2>
            <p>{t('section2.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section3.title')}</h2>
            <p>{t('section3.intro')}</p>
            <ul className="list-disc pl-6 mt-2">
              <li>{t('section3.item1')}</li>
              <li>{t('section3.item2')}</li>
              <li>{t('section3.item3')}</li>
              <li>{t('section3.item4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section4.title')}</h2>
            <p dangerouslySetInnerHTML={{ __html: t('section4.plans') }} />
            <p className="mt-2" dangerouslySetInnerHTML={{ __html: t('section4.payments') }} />
            <p className="mt-2" dangerouslySetInnerHTML={{ __html: t('section4.cancellation') }} />
            <p className="mt-2" dangerouslySetInnerHTML={{ __html: t('section4.priceChanges') }} />
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section5.title')}</h2>
            <p>{t('section5.intro')}</p>
            <ul className="list-disc pl-6 mt-2">
              <li>{t('section5.item1')}</li>
              <li>{t('section5.item2')}</li>
              <li>{t('section5.item3')}</li>
              <li>{t('section5.item4')}</li>
              <li>{t('section5.item5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section6.title')}</h2>
            <p>{t('section6.content1')}</p>
            <p className="mt-2">{t('section6.content2')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section7.title')}</h2>
            <p>{t('section7.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section8.title')}</h2>
            <p>{t('section8.content1')}</p>
            <p className="mt-2">{t('section8.content2')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section9.title')}</h2>
            <p>{t('section9.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section10.title')}</h2>
            <p>{t('section10.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section11.title')}</h2>
            <p>{t('section11.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section12.title')}</h2>
            <p>{t('section12.intro')}</p>
            <p className="mt-2">
              {t('section12.email', { email: config.emails.support })}
            </p>
          </section>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
