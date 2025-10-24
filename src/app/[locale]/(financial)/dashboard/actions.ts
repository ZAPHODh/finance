"use server"

import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { cacheWithTag, CacheTags } from "@/lib/server/cache"
import {
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays
} from "date-fns"

interface DashboardFilters {
  period?: string
  driverId?: string | null
  vehicleId?: string | null
  companyId?: string | null
}

function getDateRange(period: string = "thisMonth") {
  const now = new Date()

  switch (period) {
    case "today":
      return {
        start: startOfToday(),
        end: endOfToday(),
      }
    case "thisWeek":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      }
    case "thisMonth":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }
    case "last30Days":
      return {
        start: subDays(startOfToday(), 30),
        end: endOfToday(),
      }
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }
  }
}

async function getDashboardDataUncached(userId: string, filters: DashboardFilters) {
  const { start, end } = getDateRange(filters.period)

  const dateFilter = {
    gte: start,
    lte: end,
  }

  const revenues = await prisma.revenue.findMany({
    where: {
      date: dateFilter,
      ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
      ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
      ...(filters.companyId && filters.companyId !== "all" && { companyId: filters.companyId }),
      driver: {
        userId: userId,
      },
    },
    include: {
      company: true,
      driver: true,
      vehicle: true,
    },
  })

  const expenses = await prisma.expense.findMany({
    where: {
      date: dateFilter,
      ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
      ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
      driver: {
        userId: userId,
      },
    },
    include: {
      expenseType: true,
      driver: true,
      vehicle: true,
    },
  })


  const workLogs = await prisma.workLog.findMany({
    where: {
      date: dateFilter,
      ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
      ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
      driver: {
        userId: userId,
      },
    },
  })


  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const netProfit = totalRevenue - totalExpenses
  const totalKm = [...revenues, ...workLogs].reduce((sum, item) => {
    return sum + (item.kmDriven || 0)
  }, 0)
  const totalHours = [...revenues, ...workLogs].reduce((sum, item) => {
    return sum + ('hoursWorked' in item ? item.hoursWorked || 0 : 0)
  }, 0)


  const revenueByCompany = revenues.reduce((acc, r) => {
    const companyName = r.company?.name || "Sem empresa"
    if (!acc[companyName]) {
      acc[companyName] = 0
    }
    acc[companyName] += r.amount
    return acc
  }, {} as Record<string, number>)

  const expensesByType = expenses.reduce((acc, e) => {
    const typeName = e.expenseType.name
    if (!acc[typeName]) {
      acc[typeName] = 0
    }
    acc[typeName] += e.amount
    return acc
  }, {} as Record<string, number>)

  const performanceByDriver = revenues.reduce((acc, r) => {
    const driverName = r.driver?.name || "Sem motorista"
    if (!acc[driverName]) {
      acc[driverName] = { revenue: 0, expenses: 0 }
    }
    acc[driverName].revenue += r.amount
    return acc
  }, {} as Record<string, { revenue: number; expenses: number }>)

  expenses.forEach((e) => {
    const driverName = e.driver?.name || "Sem motorista"
    if (!performanceByDriver[driverName]) {
      performanceByDriver[driverName] = { revenue: 0, expenses: 0 }
    }
    performanceByDriver[driverName].expenses += e.amount
  })

  const performanceByVehicle = revenues.reduce((acc, r) => {
    const vehicleName = r.vehicle?.name || "Sem veículo"
    if (!acc[vehicleName]) {
      acc[vehicleName] = { revenue: 0, expenses: 0 }
    }
    acc[vehicleName].revenue += r.amount
    return acc
  }, {} as Record<string, { revenue: number; expenses: number }>)

  expenses.forEach((e) => {
    const vehicleName = e.vehicle?.name || "Sem veículo"
    if (!performanceByVehicle[vehicleName]) {
      performanceByVehicle[vehicleName] = { revenue: 0, expenses: 0 }
    }
    performanceByVehicle[vehicleName].expenses += e.amount
  })

  const transactions = [
    ...revenues.map(r => ({
      id: `rev-${r.id}`,
      description: r.description || `Receita - ${r.company?.name || 'Sem empresa'}`,
      category: r.company?.name || 'Sem empresa',
      amount: r.amount,
      type: 'revenue' as const,
      date: r.date,
      driver: r.driver?.name,
      vehicle: r.vehicle?.name,
      company: r.company?.name,
    })),
    ...expenses.map(e => ({
      id: `exp-${e.id}`,
      description: e.description || `Despesa - ${e.expenseType.name}`,
      category: e.expenseType.name,
      amount: e.amount,
      type: 'expense' as const,
      date: e.date,
      driver: e.driver?.name,
      vehicle: e.vehicle?.name,
      company: undefined,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const chartDataMap = new Map<string, { revenue: number; expenses: number }>()

  revenues.forEach(r => {
    const dateKey = r.date.toISOString().split('T')[0]
    const existing = chartDataMap.get(dateKey) || { revenue: 0, expenses: 0 }
    chartDataMap.set(dateKey, { ...existing, revenue: existing.revenue + r.amount })
  })

  expenses.forEach(e => {
    const dateKey = e.date.toISOString().split('T')[0]
    const existing = chartDataMap.get(dateKey) || { revenue: 0, expenses: 0 }
    chartDataMap.set(dateKey, { ...existing, expenses: existing.expenses + e.amount })
  })

  const chartData = Array.from(chartDataMap.entries())
    .map(([date, data]) => ({
      date,
      revenue: data.revenue,
      expenses: data.expenses,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    kpis: {
      totalRevenue,
      totalExpenses,
      netProfit,
      totalKm,
      totalHours,
    },
    breakdowns: {
      revenueByCompany: Object.entries(revenueByCompany)
        .map(([name, value]) => ({ name, value, percentage: (value / totalRevenue) * 100 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      expensesByType: Object.entries(expensesByType)
        .map(([name, value]) => ({ name, value, percentage: (value / totalExpenses) * 100 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      performanceByDriver: Object.entries(performanceByDriver)
        .map(([name, data]) => ({
          name,
          value: data.revenue - data.expenses,
          revenue: data.revenue,
          expenses: data.expenses,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      performanceByVehicle: Object.entries(performanceByVehicle)
        .map(([name, data]) => ({
          name,
          value: data.revenue - data.expenses,
          revenue: data.revenue,
          expenses: data.expenses,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
    },
    chartData,
    transactions,
  }
}

const getCachedDashboardData = cacheWithTag(
  getDashboardDataUncached,
  ['dashboard-data'],
  [CacheTags.DASHBOARD, CacheTags.REVENUES, CacheTags.EXPENSES, CacheTags.WORK_LOGS],
  300
)

export async function getDashboardData(filters: DashboardFilters) {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  return getCachedDashboardData(user.id, filters)
}

async function getDashboardFilterOptionsUncached(userId: string) {
  const [drivers, vehicles, companies] = await Promise.all([
    prisma.driver.findMany({
      where: { userId: userId },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId: userId },
      orderBy: { name: "asc" },
    }),
    prisma.company.findMany({
      where: { userId: userId },
      orderBy: { name: "asc" },
    }),
  ])

  return { drivers, vehicles, companies }
}

const getCachedDashboardFilterOptions = cacheWithTag(
  getDashboardFilterOptionsUncached,
  ['dashboard-filters'],
  [CacheTags.DRIVERS, CacheTags.VEHICLES, CacheTags.COMPANIES],
  600
)

export async function getDashboardFilterOptions() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  return getCachedDashboardFilterOptions(user.id)
}
