"use client"

import { useState, useEffect } from "react"
import { useScopedI18n } from "@/locales/client"
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  MapPin,
  Clock,
  Building2,
  Tag,
  Users,
  Car,
} from "lucide-react"
import { StatCard } from "./stat-card"
import { BreakdownCard } from "./breakdown-card"
import { TransactionsSection } from "./transactions-section"
import { useDashboardFilters } from "@/hooks/use-dashboard-filters"
import { getDashboardData } from "@/app/[locale]/(financial)/dashboard/actions"

export function DashboardContent() {
  const { filters } = useDashboardFilters()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const tDashboard = useScopedI18n("shared.sidebar.dashboard")
  const tKpis = useScopedI18n("shared.sidebar.dashboard.kpis")
  const tBreakdowns = useScopedI18n("shared.sidebar.dashboard.breakdowns")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await getDashboardData({
          period: filters.period,
          driverId: filters.driverId,
          vehicleId: filters.vehicleId,
          companyId: filters.companyId,
        })
        setData(result)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg border bg-muted"
            />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg border bg-muted"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title={tKpis("totalRevenue")}
          value={formatCurrency(data.kpis.totalRevenue)}
          icon={TrendingUp}
        />
        <StatCard
          title={tKpis("totalExpenses")}
          value={formatCurrency(data.kpis.totalExpenses)}
          icon={TrendingDown}
        />
        <StatCard
          title={tKpis("netProfit")}
          value={formatCurrency(data.kpis.netProfit)}
          icon={DollarSign}
        />
        <StatCard
          title={tKpis("totalKm")}
          value={formatNumber(data.kpis.totalKm)}
          icon={MapPin}
        />
        <StatCard
          title={tKpis("totalHours")}
          value={formatNumber(data.kpis.totalHours)}
          icon={Clock}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BreakdownCard
          title={tBreakdowns("revenueByCompany")}
          items={data.breakdowns.revenueByCompany}
          icon={Building2}
          emptyMessage={tBreakdowns("noData")}
          formatValue={formatCurrency}
        />
        <BreakdownCard
          title={tBreakdowns("expensesByType")}
          items={data.breakdowns.expensesByType}
          icon={Tag}
          emptyMessage={tBreakdowns("noData")}
          formatValue={formatCurrency}
        />
        <BreakdownCard
          title={tBreakdowns("performanceByDriver")}
          items={data.breakdowns.performanceByDriver}
          icon={Users}
          emptyMessage={tBreakdowns("noData")}
          formatValue={formatCurrency}
        />
        <BreakdownCard
          title={tBreakdowns("performanceByVehicle")}
          items={data.breakdowns.performanceByVehicle}
          icon={Car}
          emptyMessage={tBreakdowns("noData")}
          formatValue={formatCurrency}
        />
      </div>

      {data.transactions && data.transactions.length > 0 && (
        <TransactionsSection
          transactions={data.transactions}
          locale="pt"
        />
      )}
    </div>
  )
}
