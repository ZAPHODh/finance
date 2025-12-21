import { getScopedI18n } from "@/locales/server";
import { X, Check } from "lucide-react";

export default async function Comparison() {
  const t = await getScopedI18n("marketing");

  const manualItems = [
    t("comparison.manual.item1"),
    t("comparison.manual.item2"),
    t("comparison.manual.item3"),
    t("comparison.manual.item4"),
    t("comparison.manual.item5"),
    t("comparison.manual.item6"),
    t("comparison.manual.item7"),
    t("comparison.manual.item8"),
  ];

  const automatedItems = [
    t("comparison.automated.item1"),
    t("comparison.automated.item2"),
    t("comparison.automated.item3"),
    t("comparison.automated.item4"),
    t("comparison.automated.item5"),
    t("comparison.automated.item6"),
    t("comparison.automated.item7"),
    t("comparison.automated.item8"),
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
            {t("comparison.badge")}
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t("comparison.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("comparison.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-muted/30 rounded-lg border border-border p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {t("comparison.manual.title")}
            </h3>
            <ul className="space-y-4">
              {manualItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/5 rounded-lg border-2 border-primary p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
              {t("comparison.recommendedBadge")}
            </div>
            <h3 className="text-2xl font-bold mb-6 text-center">
              {t("comparison.automated.title")}
            </h3>
            <ul className="space-y-4">
              {automatedItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
