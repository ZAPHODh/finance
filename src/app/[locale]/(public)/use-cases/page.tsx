import { getScopedI18n } from "@/locales/server";
import { User, Users2, Building2, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function UseCasesPage() {
  const t = await getScopedI18n("marketing");

  const cases = [
    {
      icon: User,
      title: t("useCases.solo.title"),
      description: t("useCases.solo.description"),
      challenge: t("useCases.solo.challenge"),
      solution: t("useCases.solo.solution"),
      result: t("useCases.solo.result"),
      badge: t("useCases.solo.badge"),
      plan: "free",
    },
    {
      icon: Users2,
      title: t("useCases.smallFleet.title"),
      description: t("useCases.smallFleet.description"),
      challenge: t("useCases.smallFleet.challenge"),
      solution: t("useCases.smallFleet.solution"),
      result: t("useCases.smallFleet.result"),
      badge: t("useCases.smallFleet.badge"),
      plan: "simple",
    },
    {
      icon: Building2,
      title: t("useCases.largeFleet.title"),
      description: t("useCases.largeFleet.description"),
      challenge: t("useCases.largeFleet.challenge"),
      solution: t("useCases.largeFleet.solution"),
      result: t("useCases.largeFleet.result"),
      badge: t("useCases.largeFleet.badge"),
      plan: "pro",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background pt-24 pb-16">
        <div className="container px-4 mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
            {t("useCases.badge")}
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            {t("useCases.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("useCases.subtitle")}
          </p>
        </div>
      </div>

      <section className="py-16 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto space-y-16">
            {cases.map((useCase, index) => (
              <div
                key={index}
                className="grid lg:grid-cols-2 gap-8 items-start"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="sticky top-8">
                    <div className="mb-6">
                      <div className="inline-flex p-4 bg-primary/10 rounded-lg mb-4">
                        <useCase.icon className="h-10 w-10 text-primary" />
                      </div>
                      <div className="inline-block ml-2 px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground rounded">
                        {useCase.badge}
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-3">{useCase.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      {useCase.description}
                    </p>

                    <Link href="/pricing">
                      <Button size="lg" className="w-full sm:w-auto">
                        {t("hero.getStarted")}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle className="h-6 w-6 text-destructive mt-0.5 shrink-0" />
                      <h3 className="text-xl font-semibold">{t("useCases.challengeLabel")}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {useCase.challenge}
                    </p>
                  </div>

                  <div className="bg-card rounded-lg border border-primary/50 p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                      <h3 className="text-xl font-semibold">{t("useCases.solutionLabel")}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {useCase.solution}
                    </p>
                  </div>

                  <div className="bg-primary/5 rounded-lg border border-primary p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <TrendingUp className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                      <h3 className="text-xl font-semibold">{t("useCases.resultsLabel")}</h3>
                    </div>
                    <p className="font-medium text-primary leading-relaxed">
                      {useCase.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 mb-0">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("useCases.cta.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("useCases.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">{t("hero.getStarted")}</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                {t("hero.viewPricing")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
