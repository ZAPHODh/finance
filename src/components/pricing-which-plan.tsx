import { getScopedI18n } from "@/locales/server";
import { Sparkles, TrendingUp, Rocket } from "lucide-react";

export default async function PricingWhichPlan() {
  const t = await getScopedI18n("marketing.pricing");

  const plans = [
    {
      icon: Sparkles,
      title: t("whichPlan.card1.title"),
      description: t("whichPlan.card1.description"),
      ideal: t("whichPlan.card1.ideal"),
    },
    {
      icon: TrendingUp,
      title: t("whichPlan.card2.title"),
      description: t("whichPlan.card2.description"),
      ideal: t("whichPlan.card2.ideal"),
    },
    {
      icon: Rocket,
      title: t("whichPlan.card3.title"),
      description: t("whichPlan.card3.description"),
      ideal: t("whichPlan.card3.ideal"),
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
            {t("whichPlan.badge")}
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {t("whichPlan.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("whichPlan.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-background rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
            >
              <div className="mb-4">
                <div className="inline-flex p-3 bg-primary/10 rounded-lg">
                  <plan.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <p className="text-sm font-medium text-primary">{plan.ideal}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
