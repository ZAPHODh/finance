import { getScopedI18n } from "@/locales/server";
import { Target, BookOpen, Lightbulb, ShieldCheck, User, Users2, Building2 } from "lucide-react";

export default async function AboutPage() {
  const t = await getScopedI18n("marketing");

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background pt-24 pb-16">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            {t("about.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
              {t("about.mission.badge")}
            </div>
            <h2 className="text-3xl font-bold mb-4">{t("about.mission.title")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.mission.description")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
              {t("about.story.badge")}
            </div>
            <h2 className="text-3xl font-bold mb-4">{t("about.story.title")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.story.description")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
                {t("about.values.badge")}
              </div>
              <h2 className="text-3xl font-bold">{t("about.values.title")}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("about.values.value1.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.values.value1.description")}
                </p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("about.values.value2.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.values.value2.description")}
                </p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("about.values.value3.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.values.value3.description")}
                </p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("about.values.value4.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.values.value4.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
              {t("about.vision.badge")}
            </div>
            <h2 className="text-3xl font-bold mb-4">{t("about.vision.title")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.vision.description")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full">
                {t("about.forWho.badge")}
              </div>
              <h2 className="text-3xl font-bold">{t("about.forWho.title")}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-card rounded-lg border border-border text-center">
                <div className="inline-flex p-4 bg-primary/10 rounded-lg mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("about.forWho.solo.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.forWho.solo.description")}
                </p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border text-center">
                <div className="inline-flex p-4 bg-primary/10 rounded-lg mb-4">
                  <Users2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("about.forWho.fleet.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.forWho.fleet.description")}
                </p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border text-center">
                <div className="inline-flex p-4 bg-primary/10 rounded-lg mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("about.forWho.enterprise.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.forWho.enterprise.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
