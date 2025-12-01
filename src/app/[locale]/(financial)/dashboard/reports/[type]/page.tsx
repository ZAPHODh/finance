import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect, notFound } from "next/navigation";
import { AVAILABLE_REPORTS } from "@/lib/reports/types";
import { ReportViewer } from "@/components/reports/report-viewer";
import { getFilterOptions } from "./filters-actions";
import { prisma } from "@/lib/server/db";

interface ReportPageProps {
  params: Promise<{
    type: string;
  }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { type } = await params;
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const reportConfig = AVAILABLE_REPORTS.find(
    r => r.type.toLowerCase() === type.toLowerCase()
  );

  if (!reportConfig) {
    notFound();
  }

  const filterOptions = await getFilterOptions();

  // Get user's plan for partner recommendations
  const userAccount = await prisma.user.findUnique({
    where: { id: user.id },
    select: { planType: true },
  });

  return (
    <div className="container mx-auto px-4 md:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{reportConfig.name}</h1>
          <p className="text-muted-foreground mt-2">
            {reportConfig.description}
          </p>
        </div>
      </div>

      <ReportViewer
        reportConfig={reportConfig}
        userId={user.id}
        userPlanType={userAccount?.planType || 'FREE'}
        filterOptions={filterOptions}
      />
    </div>
  );
}
