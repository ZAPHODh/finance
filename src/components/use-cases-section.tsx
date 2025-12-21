import { getScopedI18n } from "@/locales/server";
import { User, Users2, Building2, CheckCircle2, AlertCircle } from "lucide-react";

export default async function UseCasesSection() {
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
    },
    {
      icon: Users2,
      title: t("useCases.smallFleet.title"),
      description: t("useCases.smallFleet.description"),
      challenge: t("useCases.smallFleet.challenge"),
      solution: t("useCases.smallFleet.solution"),
      result: t("useCases.smallFleet.result"),
      badge: t("useCases.smallFleet.badge"),
    },
    {
      icon: Building2,
      title: t("useCases.largeFleet.title"),
      description: t("useCases.largeFleet.description"),
      challenge: t("useCases.largeFleet.challenge"),
      solution: t("useCases.largeFleet.solution"),
      result: t("useCases.largeFleet.result"),
      badge: t("useCases.largeFleet.badge"),
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
            {t("useCases.badge")}
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t("useCases.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("useCases.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {cases.map((useCase, index) => (
            <div
              key={index}
              className="bg-background rounded-lg border border-border shadow-sm hover:shadow-lg transition-shadow p-8"
            >
              <div className="mb-6">
                <div className="inline-flex p-4 bg-primary/10 rounded-lg mb-4">
                  <useCase.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="inline-block ml-2 px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">
                  {useCase.badge}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {useCase.description}
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">{t("useCases.challengeLabel")}</h4>
                      <p className="text-sm text-muted-foreground">
                        {useCase.challenge}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">{t("useCases.solutionLabel")}</h4>
                      <p className="text-sm text-muted-foreground">
                        {useCase.solution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm mb-2">{t("useCases.resultLabel")}</h4>
                  <p className="text-sm font-medium text-primary">
                    {useCase.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
