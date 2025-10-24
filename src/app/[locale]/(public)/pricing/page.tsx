'use server';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import Pricing from "@/components/pricing";
import { getScopedI18n } from "@/locales/server";

export default async function PricingPage() {
  const t = await getScopedI18n("shared.pricing");

  return (
    <>
      <Nav />
      <main className="container mx-auto max-w-6xl px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <Pricing />
      </main>
      <FooterSection />
    </>
  );
}
