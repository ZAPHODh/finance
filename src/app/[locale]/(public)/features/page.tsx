'use server';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import Features from "@/components/features-3";
import { getScopedI18n } from "@/locales/server";

export default async function FeaturesPage() {
  const t = await getScopedI18n("shared.features");

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
        <Features />
      </main>
      <FooterSection />
    </>
  );
}
