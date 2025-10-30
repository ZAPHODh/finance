"use client"

import { useState, useEffect } from "react"
import { useScopedI18n } from "@/locales/client"
import {
  Building2,
  Tag,
  Users,
  Car,
} from "lucide-react"
import { SectionCards } from "@/components/dashboard-01/section-cards"
import { ChartAreaInteractive } from "@/components/dashboard-01/chart-area-interactive"
import { BreakdownCard } from "./breakdown-card"
import { TransactionsSection } from "./transactions-section"
import { GoalsSection } from "./goals-section"
import { useDashboardQueryFilters } from "@/hooks/use-dashboard-query-filters"
import { getDashboardData } from "@/app/[locale]/(financial)/dashboard/actions"

interface DashboardData {
  kpis: {
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    totalKm: number
    totalHours: number
  }
  breakdowns: {
    revenueByPlatform: Array<{ name: string; value: number; percentage: number }>
    expensesByType: Array<{ name: string; value: number; percentage: number }>
    performanceByDriver: Array<{ name: string; value: number; revenue: number; expenses: number }>
    performanceByVehicle: Array<{ name: string; value: number; revenue: number; expenses: number }>
  }
  chartData?: Array<{
    date: string
    revenue: number
    expenses: number
  }>
  transactions: Array<{
    id: string
    description: string
    category: string
    amount: number
    type: 'revenue' | 'expense'
    date: Date
    driver?: string
    vehicle?: string
    company?: string
  }>
}

export function DashboardContent() {
  const { filters } = useDashboardQueryFilters()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
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
          platformId: filters.platformId,
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
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg border bg-muted"
            />
          ))}
        </div>
        <div className="px-4 lg:px-6">
          <div className="h-[350px] animate-pulse rounded-lg border bg-muted" />
        </div>
        <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-6">
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
    <>
      <SectionCards kpis={data.kpis} />

      {data.chartData && data.chartData.length > 0 && (
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive data={data.chartData} />
        </div>
      )}

      <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-6">
        <BreakdownCard
          title={tBreakdowns("revenueByPlatform")}
          items={data.breakdowns.revenueByPlatform}
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
        <div className="px-4 lg:px-6">
          <TransactionsSection
            transactions={data.transactions}
            locale="pt"
          />
        </div>
      )}

      <div className="px-4 pt-6 lg:px-6">
        <GoalsSection />
      </div>
    </>
  )
}
