import { getCurrentSession } from "@/lib/server/auth/session"
import { getDashboardData, getDashboardFilterOptions, getColumnVisibility, setColumnVisibility } from "./actions"
import { SectionCards } from "./_components/section-cards"
import { DataTable } from "./_components/data-table"
import { EfficiencyCards } from "./_components/efficiency-cards"
import { DashboardFilters } from "./_components/dashboard-filters"
import { getUserSubscriptionPlan, getPlanLimits } from "@/lib/server/payment"
import { shouldShowAds } from "@/lib/ads/should-show-ads"
import { ContextualPartnerAd } from "@/components/ads/contextual-partner-ad"
import { AdSenseBanner } from "@/components/ads/adsense-banner"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"
import { PartnerAdBanner } from "@/components/ads/partner-ad-banner"

const ChartAreaInteractive = dynamic(
  () => import('./_components/chart-area-interactive').then(m => ({ default: m.ChartAreaInteractive })),
  {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

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
  if (!user) redirect('/login')
  const params = await searchParams
  const period = params.period || "thisMonth"
  const driverId = params.driver || null
  const vehicleId = params.vehicle || null
  const platformId = params.platform || null

  const [dashboardData, subscriptionPlan, filterOptions, columnVisibility] = await Promise.all([
    getDashboardData({
      period,
      driverId,
      vehicleId,
      platformId,
    }),
    getUserSubscriptionPlan(user.id),
    getDashboardFilterOptions(),
    getColumnVisibility(),
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
              <ContextualPartnerAd
                context="top-expense"
                fallbackCategory="FUEL"
                location="dashboard_after_kpis"
              />
            </div>
          )}
          {showAds && (
            <div className="px-4 lg:px-6">
              <AdSenseBanner slot="4721006886" />
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
          <DataTable
            data={dashboardData.transactions}
            initialColumnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </div>
      </div>
    </div>
  )
}
