import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import { PricingTableThree } from "@/components/billingsdk/pricing-table-three";
import { getCurrentLocale, getScopedI18n } from "@/locales/server";
import { getPlanConfigs } from "@/config/subscription";



export default async function PricingPage() {
  const t = await getScopedI18n("marketing.pricing");
  const locale = await getCurrentLocale()
  const planConfigs = await getPlanConfigs(locale)
  const plans = [planConfigs.free, planConfigs.simple, planConfigs.pro]
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
          showFooter={true}
        />
      </main>
      <FooterSection />
    </>
  );
}
