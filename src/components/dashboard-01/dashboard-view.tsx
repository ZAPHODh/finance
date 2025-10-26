"use client"

import { useState, useEffect } from "react"
import { Driver, Vehicle, Platform } from "@prisma/client"
import { SectionCards } from "./section-cards"
import { ChartAreaInteractive } from "./chart-area-interactive"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { useDashboardFilters } from "@/hooks/use-dashboard-filters"
import { getDashboardData } from "@/app/[locale]/(financial)/dashboard/actions"

interface DashboardData {
  kpis: {
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    totalKm: number
    totalHours: number
  }
  chartData?: Array<{
    date: string
    revenue: number
    expenses: number
  }>
}

interface DashboardViewProps {
  drivers: Driver[]
  vehicles: Vehicle[]
  platforms: Platform[]
}

export function DashboardView({
  drivers,
  vehicles,
  platforms,
}: DashboardViewProps) {
  const { filters } = useDashboardFilters()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading || !data) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="h-10 animate-pulse rounded-lg border bg-muted" />
        </div>
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
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <DashboardFilters
          drivers={drivers}
          vehicles={vehicles}
          platforms={platforms}
        />
      </div>

      <SectionCards kpis={data.kpis} />

      {data.chartData && data.chartData.length > 0 && (
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive data={data.chartData} />
        </div>
      )}
    </div>
  )
}
