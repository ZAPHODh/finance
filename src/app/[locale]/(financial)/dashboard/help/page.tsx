import { getScopedI18n } from "@/locales/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, TrendingDown, TrendingUp, PiggyBank, Target, Keyboard, HelpCircle } from "lucide-react";

export default async function HelpPage() {
  const t = await getScopedI18n("ui.help");

  const features = [
    {
      icon: LayoutDashboard,
      title: t("features.dashboard.title"),
      description: t("features.dashboard.description"),
    },
    {
      icon: TrendingDown,
      title: t("features.expenses.title"),
      description: t("features.expenses.description"),
    },
    {
      icon: TrendingUp,
      title: t("features.revenues.title"),
      description: t("features.revenues.description"),
    },
    {
      icon: PiggyBank,
      title: t("features.budgets.title"),
      description: t("features.budgets.description"),
    },
    {
      icon: Target,
      title: t("features.goals.title"),
      description: t("features.goals.description"),
    },
  ];

  const shortcuts = [
    { keys: ["Ctrl", "K"], description: t("keyboard.search") },
    { keys: ["Ctrl", "E"], description: t("keyboard.newExpense") },
    { keys: ["Ctrl", "R"], description: t("keyboard.newRevenue") },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("gettingStarted.title")}</CardTitle>
          <CardDescription>{t("gettingStarted.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>{t("gettingStarted.step1")}</li>
            <li>{t("gettingStarted.step2")}</li>
            <li>{t("gettingStarted.step3")}</li>
            <li>{t("gettingStarted.step4")}</li>
          </ol>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-2xl font-semibold mb-4">{t("features.title")}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            <CardTitle>{t("keyboard.title")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{shortcut.description}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, i) => (
                    <kbd
                      key={i}
                      className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <CardTitle>{t("support.title")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("support.description")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
