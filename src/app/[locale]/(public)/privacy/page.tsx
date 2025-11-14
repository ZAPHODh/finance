'use client';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import { useScopedI18n, useCurrentLocale } from "@/locales/client";
import { siteConfig } from "@/config/site";

export default function PrivacyPage() {
  const t = useScopedI18n('marketing.privacy');
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

            <h3 className="text-xl font-semibold mb-2 mt-4">{t('section2.registration.title')}</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>{t('section2.registration.item1')}</li>
              <li>{t('section2.registration.item2')}</li>
              <li>{t('section2.registration.item3')}</li>
              <li>{t('section2.registration.item4')}</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">{t('section2.financial.title')}</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>{t('section2.financial.item1')}</li>
              <li>{t('section2.financial.item2')}</li>
              <li>{t('section2.financial.item3')}</li>
              <li>{t('section2.financial.item4')}</li>
              <li>{t('section2.financial.item5')}</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">{t('section2.payment.title')}</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>{t('section2.payment.item1')}</li>
              <li>{t('section2.payment.item2')}</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">{t('section2.usage.title')}</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>{t('section2.usage.item1')}</li>
              <li>{t('section2.usage.item2')}</li>
              <li>{t('section2.usage.item3')}</li>
              <li>{t('section2.usage.item4')}</li>
              <li>{t('section2.usage.item5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section3.title')}</h2>
            <p>{t('section3.intro')}</p>
            <ul className="list-disc pl-6 mt-2">
              <li>{t('section3.item1')}</li>
              <li>{t('section3.item2')}</li>
              <li>{t('section3.item3')}</li>
              <li>{t('section3.item4')}</li>
              <li>{t('section3.item5')}</li>
              <li>{t('section3.item6')}</li>
              <li>{t('section3.item7')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section4.title')}</h2>
            <p>{t('section4.intro')}</p>
            <ul className="list-disc pl-6 mt-2">
              <li dangerouslySetInnerHTML={{ __html: t('section4.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section4.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section4.item3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section4.item4') }} />
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section5.title')}</h2>
            <p>{t('section5.intro')}</p>
            <ul className="list-disc pl-6 mt-2">
              <li dangerouslySetInnerHTML={{ __html: t('section5.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section5.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section5.item3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section5.item4') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section5.item5') }} />
            </ul>
            <p className="mt-2">{t('section5.footer')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section6.title')}</h2>
            <p>{t('section6.intro')}</p>
            <ul className="list-disc pl-6 mt-2">
              <li>{t('section6.item1')}</li>
              <li>{t('section6.item2')}</li>
              <li>{t('section6.item3')}</li>
              <li>{t('section6.item4')}</li>
              <li>{t('section6.item5')}</li>
              <li>{t('section6.item6')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section7.title')}</h2>
            <p>{t('section7.intro')}</p>
            <ul className="list-disc pl-6 mt-2">
              <li dangerouslySetInnerHTML={{ __html: t('section7.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section7.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section7.item3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section7.item4') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section7.item5') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section7.item6') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section7.item7') }} />
            </ul>
            <p className="mt-4">
              {t('section7.footer', { email: config.emails.support })}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section8.title')}</h2>
            <p>{t('section8.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section9.title')}</h2>
            <p>{t('section9.intro')}</p>
            <ul className="list-disc pl-6 mt-2">
              <li dangerouslySetInnerHTML={{ __html: t('section9.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section9.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('section9.item3') }} />
            </ul>
            <p className="mt-2">{t('section9.footer')}</p>
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
            <p>{t('section12.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section13.title')}</h2>
            <p>{t('section13.intro')}</p>
            <p className="mt-2">
              {t('section13.email', { email: config.emails.privacy })}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section14.title')}</h2>
            <p>{t('section14.content')}</p>
          </section>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
