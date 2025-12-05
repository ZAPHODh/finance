import { getCurrentSession } from "@/lib/server/auth/session"
import { getDashboardData, getDashboardFilterOptions } from "./actions"
import { SectionCards } from "@/components/dashboard-01/section-cards"
import { ChartAreaInteractive } from "@/components/dashboard-01/chart-area-interactive"
import { DataTable } from "@/components/dashboard-01/data-table"
import { EfficiencyCards } from "@/components/dashboard/efficiency-cards"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { getUserSubscriptionPlan, getPlanLimits } from "@/lib/server/payment"
import { shouldShowAds } from "@/lib/ads/should-show-ads"
import { PartnerAdBanner } from "@/components/ads/partner-ad-banner"

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

  const params = await searchParams
  const period = params.period || "thisMonth"
  const driverId = params.driver || null
  const vehicleId = params.vehicle || null
  const platformId = params.platform || null

  const [dashboardData, subscriptionPlan, filterOptions] = await Promise.all([
    getDashboardData({
      period,
      driverId,
      vehicleId,
      platformId,
    }),
    getUserSubscriptionPlan(user.id),
    getDashboardFilterOptions(),
  ])

  const planLimits = getPlanLimits(subscriptionPlan.name)
  const hasPeriodComparisons = planLimits.hasPeriodComparisons
  const hasEfficiencyMetrics = planLimits.hasEfficiencyMetrics
  const showAds = await shouldShowAds()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DashboardFilters
            drivers={filterOptions.drivers}
            vehicles={filterOptions.vehicles}
            platforms={filterOptions.platforms}
          />
          <SectionCards
            kpis={dashboardData.kpis}
            trends={hasPeriodComparisons ? dashboardData.growth : undefined}
          />
          {showAds && (
            <div className="px-4 lg:px-6">
              <PartnerAdBanner category="FUEL" location="dashboard_after_kpis" />
            </div>
          )}
          {hasEfficiencyMetrics && (
            <EfficiencyCards
              metrics={dashboardData.efficiencyMetrics}
              paymentFees={dashboardData.paymentFees}
            />
          )}
          {dashboardData.chartData && dashboardData.chartData.length > 0 && (
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive data={dashboardData.chartData} />
            </div>
          )}
          {showAds && (
            <div className="px-4 lg:px-6">
              <PartnerAdBanner category="MAINTENANCE" location="dashboard_before_table" />
            </div>
          )}
          <DataTable data={dashboardData.transactions} />
        </div>
      </div>
    </div>
  )
}
