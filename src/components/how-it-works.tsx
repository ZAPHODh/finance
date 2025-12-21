import { getScopedI18n } from "@/locales/server";
import { UserPlus, Receipt, BarChart3, FileText } from "lucide-react";

export default async function HowItWorks() {
  const t = await getScopedI18n("marketing");

  const steps = [
    {
      icon: UserPlus,
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
      step: "01",
    },
    {
      icon: Receipt,
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
      step: "02",
    },
    {
      icon: BarChart3,
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
      step: "03",
    },
    {
      icon: FileText,
      title: t("howItWorks.step4.title"),
      description: t("howItWorks.step4.description"),
      step: "04",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
            {t("howItWorks.badge")}
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 bg-background rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                {step.step}
              </div>
              <div className="mb-4 mt-2">
                <step.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
