import { getScopedI18n } from "@/locales/server";
import { Network, FileCheck, TrendingUp, Users, Target, Shield } from "lucide-react";

export default async function WhyChoose() {
  const t = await getScopedI18n("marketing");

  const benefits = [
    {
      icon: Network,
      title: t("whyChoose.benefit1.title"),
      description: t("whyChoose.benefit1.description"),
    },
    {
      icon: FileCheck,
      title: t("whyChoose.benefit2.title"),
      description: t("whyChoose.benefit2.description"),
    },
    {
      icon: TrendingUp,
      title: t("whyChoose.benefit3.title"),
      description: t("whyChoose.benefit3.description"),
    },
    {
      icon: Users,
      title: t("whyChoose.benefit4.title"),
      description: t("whyChoose.benefit4.description"),
    },
    {
      icon: Target,
      title: t("whyChoose.benefit5.title"),
      description: t("whyChoose.benefit5.description"),
    },
    {
      icon: Shield,
      title: t("whyChoose.benefit6.title"),
      description: t("whyChoose.benefit6.description"),
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
            {t("whyChoose.badge")}
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t("whyChoose.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("whyChoose.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="mb-4">
                <div className="inline-flex p-3 bg-primary/10 rounded-lg">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
