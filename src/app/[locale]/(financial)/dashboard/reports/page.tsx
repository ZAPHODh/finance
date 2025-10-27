import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { ReportsList } from "@/components/reports/reports-list";
import { getScopedI18n } from "@/locales/server";

export default async function ReportsPage() {
  const t = await getScopedI18n('shared.reports');
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 md:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('generate')}
          </p>
        </div>
      </div>

      <ReportsList />
    </div>
  );
}
