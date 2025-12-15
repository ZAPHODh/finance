import { getCurrentSession } from "@/lib/server/auth/session"
import { getDashboardData, getDashboardFilterOptions, getColumnVisibility, setColumnVisibility, getMonthlyTrendsData, getActiveGoalsForDashboard } from "./actions"
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
import { dashboardSearchParamsCache } from "./searchParams"
import type { SearchParams } from "nuqs/server"

const ChartAreaInteractive = dynamic(
  () => import('./_components/chart-area-interactive').then(m => ({ default: m.ChartAreaInteractive })),
  {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

const ChartExpenseRadial = dynamic(
  () => import('./_components/chart-expense-radial').then(m => ({ default: m.ChartExpenseRadial })),
  {
    loading: () => <div className="h-[400px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

const ChartMonthlyTrends = dynamic(
  () => import('./_components/chart-monthly-trends').then(m => ({ default: m.ChartMonthlyTrends })),
  {
    loading: () => <div className="h-[400px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

interface DashboardPageProps {
  searchParams: Promise<SearchParams>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { user } = await getCurrentSession()
  if (!user) redirect('/login')

  const {
    period,
    driver: driverId,
    vehicle: vehicleId,
    platform: platformId
  } = await dashboardSearchParamsCache.parse(searchParams)

  const [dashboardData, subscriptionPlan, filterOptions, columnVisibility, monthlyTrends, goals] = await Promise.all([
    getDashboardData({
      period,
      driverId,
      vehicleId,
      platformId,
    }),
    getUserSubscriptionPlan(user.id),
    getDashboardFilterOptions(),
    getColumnVisibility(),
    getMonthlyTrendsData({ driverId, vehicleId, platformId }),
    getActiveGoalsForDashboard(period, { driverId, vehicleId, platformId }),
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
          <div className="grid grid-cols-1 gap-4 px-4 md:gap-6 lg:grid-cols-12 lg:px-6">
            <div className="lg:col-span-4">
              <ChartExpenseRadial
                expensesByType={dashboardData.breakdowns.expensesByType}
                totalExpenses={dashboardData.kpis.totalExpenses}
                budgetTotal={goals.budgetTotal}
                profitGoal={goals.profitGoal}
              />
            </div>
            <div className="lg:col-span-8">
              <ChartMonthlyTrends
                monthlyData={monthlyTrends}
                revenueGoal={goals.revenueGoal}
              profitGoal={goals.profitGoal}
            />
            </div>
          </div>
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
