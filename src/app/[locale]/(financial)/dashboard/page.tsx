import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getDashboardData } from "./actions"
import { SectionCards } from "@/components/dashboard-01/section-cards"
import { ChartAreaInteractive } from "@/components/dashboard-01/chart-area-interactive"
import { DataTable } from "@/components/dashboard-01/data-table"

interface DashboardPageProps {
  searchParams: Promise<{
    period?: string
    driver?: string
    vehicle?: string
    platform?: string
  }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")
  if (!user.hasCompletedOnboarding) redirect("/onboarding")

  const params = await searchParams
  const period = params.period || "thisMonth"
  const driverId = params.driver || undefined
  const vehicleId = params.vehicle || undefined
  const platformId = params.platform || undefined

  const dashboardData = await getDashboardData({
    period,
    driverId,
    vehicleId,
    platformId,
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards kpis={dashboardData.kpis} />
          {dashboardData.chartData && dashboardData.chartData.length > 0 && (
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive data={dashboardData.chartData} />
            </div>
          )}
          <DataTable data={dashboardData.transactions} />
        </div>
      </div>
    </div>
  )
}
