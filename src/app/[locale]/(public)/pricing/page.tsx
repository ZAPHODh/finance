'use client';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import { PricingTableThree } from "@/components/billingsdk/pricing-table-three";
import { plans } from "@/lib/billingsdk-config";
import { useScopedI18n } from "@/locales/client";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const t = useScopedI18n("marketing.pricing");
  const router = useRouter();

  return (
    <>
      <Nav />
      <main className="container mx-auto max-w-7xl px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <PricingTableThree
          plans={plans}
          onPlanSelect={(planId) => {
            router.push('/login');
          }}
          showFooter={true}
          footerText="Questions about pricing? We're here to help."
          footerButtonText="Contact Us"
          onFooterButtonClick={() => {
            // Add contact logic here
            console.log("Contact clicked");
          }}
        />
      </main>
      <FooterSection />
    </>
  );
}
