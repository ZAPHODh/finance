import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { getReportsData } from "./actions";
import { ReportsTable } from "@/components/reports/reports-table";
import { ReportGeneratorCard } from "@/components/reports/report-generator-card";
import { getScopedI18n } from "@/locales/server";

export default async function ReportsPage() {
  const t = await getScopedI18n('shared.reports');
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const { reports } = await getReportsData();

  return (
    <div className="container mx-auto px-4 md:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReportGeneratorCard />
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('generated')}</h2>
            <ReportsTable reports={reports} />
          </div>
        </div>
      </div>
    </div>
  );
}
