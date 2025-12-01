'use client';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScopedI18n } from "@/locales/client";
import Link from "next/link";

export default function FAQPage() {
  const t = useScopedI18n('marketing.faqs');
  const tContact = useScopedI18n('marketing.contact');

  const faqs = [
    { question: t('q1.question'), answer: t('q1.answer') },
    { question: t('q2.question'), answer: t('q2.answer') },
    { question: t('q3.question'), answer: t('q3.answer') },
    { question: t('q4.question'), answer: t('q4.answer') },
    { question: t('q5.question'), answer: t('q5.answer') },
    { question: t('q6.question'), answer: t('q6.answer') },
    { question: t('q7.question'), answer: t('q7.answer') },
    { question: t('q8.question'), answer: t('q8.answer') },
  ];

  return (
    <>
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t('title.line1')} {t('title.line2')} {t('title.line3')}
          </h1>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            {tContact('stillHaveQuestions')}
          </p>
          <Link
            href="/contact"
            className="text-primary hover:underline font-semibold"
          >
            {tContact('contactSupport')}
          </Link>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
