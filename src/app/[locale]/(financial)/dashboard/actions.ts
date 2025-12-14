"use server"

import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { cacheWithTag, CacheTags } from "@/lib/server/cache"
import type { DashboardFilters } from "@/hooks/use-dashboard-query-filters"
import { calculateGrowth, calculateEfficiencyMetrics, calculatePaymentFees } from "@/lib/analytics/metrics"
import { getDateRange, getPreviousDateRange } from "@/lib/utils"
import { cookies } from "next/headers"
import type { VisibilityState } from "@tanstack/react-table"
import { startOfMonth, format } from "date-fns"
import { GoalType } from "@prisma/client"



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
      ...(filters.platformId && filters.platformId !== "all" && {
        platforms: { some: { platformId: filters.platformId } }
      }),
      OR: [
        { driver: { userId: userId } },
        { platforms: { some: { platform: { userId: userId } } } }
      ],
    },
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
      driver: true,
      vehicle: true,
    },
  })

  const expenses = await prisma.expense.findMany({
    where: {
      date: dateFilter,
      ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
      ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
      expenseTypes: {
        some: {
          expenseType: {
            userId: userId,
          }
        }
      },
    },
    include: {
      expenseTypes: {
        include: {
          expenseType: true
        }
      },
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

  const previousDateRange = getPreviousDateRange(filters.period)
  const previousDateFilter = {
    gte: previousDateRange.start,
    lte: previousDateRange.end,
  }

  const [previousRevenues, previousExpenses, previousWorkLogs] = await Promise.all([
    prisma.revenue.findMany({
      where: {
        date: previousDateFilter,
        ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
        ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
        ...(filters.platformId && filters.platformId !== "all" && {
          platforms: { some: { platformId: filters.platformId } }
        }),
        OR: [
          { driver: { userId: userId } },
          { platforms: { some: { platform: { userId: userId } } } }
        ],
      },
      include: {
        paymentMethod: true,
      },
    }),
    prisma.expense.findMany({
      where: {
        date: previousDateFilter,
        ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
        ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
        expenseTypes: {
          some: {
            expenseType: {
              userId: userId,
            }
          }
        },
      },
    }),
    prisma.workLog.findMany({
      where: {
        date: previousDateFilter,
        ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
        ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
        driver: {
          userId: userId,
        },
      },
    }),
  ])

  const previousTotalRevenue = previousRevenues.reduce((sum, r) => sum + r.amount, 0)
  const previousTotalExpenses = previousExpenses.reduce((sum, e) => sum + e.amount, 0)
  const previousNetProfit = previousTotalRevenue - previousTotalExpenses
  const previousTotalKm = [...previousRevenues, ...previousWorkLogs].reduce((sum, item) => {
    return sum + (item.kmDriven || 0)
  }, 0)
  const previousTotalHours = [...previousRevenues, ...previousWorkLogs].reduce((sum, item) => {
    return sum + ('hoursWorked' in item ? item.hoursWorked || 0 : 0)
  }, 0)

  const growth = {
    revenue: calculateGrowth(totalRevenue, previousTotalRevenue),
    expenses: calculateGrowth(totalExpenses, previousTotalExpenses),
    profit: calculateGrowth(netProfit, previousNetProfit),
    km: calculateGrowth(totalKm, previousTotalKm),
    hours: calculateGrowth(totalHours, previousTotalHours),
  }

  const efficiencyMetrics = calculateEfficiencyMetrics(
    totalRevenue,
    totalExpenses,
    totalKm,
    totalHours,
    revenues.length
  )

  const revenuesWithPaymentMethod = await prisma.revenue.findMany({
    where: {
      date: dateFilter,
      ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
      ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
      ...(filters.platformId && filters.platformId !== "all" && {
        platforms: { some: { platformId: filters.platformId } }
      }),
      OR: [
        { driver: { userId: userId } },
        { platforms: { some: { platform: { userId: userId } } } }
      ],
    },
    include: {
      paymentMethod: true,
    },
  })

  const paymentFees = calculatePaymentFees(revenuesWithPaymentMethod)


  const revenueByPlatform = revenues.reduce((acc, r) => {
    if (r.platforms.length === 0) {
      const platformName = "Sem plataforma"
      if (!acc[platformName]) {
        acc[platformName] = 0
      }
      acc[platformName] += r.amount
    } else {
      r.platforms.forEach(p => {
        const platformName = p.platform.name
        if (!acc[platformName]) {
          acc[platformName] = 0
        }
        acc[platformName] += r.amount / r.platforms.length
      })
    }
    return acc
  }, {} as Record<string, number>)

  const expensesByType = expenses.reduce((acc, e) => {
    e.expenseTypes.forEach(et => {
      const typeName = et.expenseType.name
      if (!acc[typeName]) {
        acc[typeName] = 0
      }
      acc[typeName] += e.amount / e.expenseTypes.length
    })
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
      description: `Receita - ${r.platforms.length > 0 ? r.platforms.map(p => p.platform.name).join(', ') : 'Sem plataforma'}`,
      category: r.platforms.length > 0 ? r.platforms.map(p => p.platform.name).join(', ') : 'Sem plataforma',
      amount: r.amount,
      type: 'revenue' as const,
      date: r.date,
      driver: r.driver?.name,
      vehicle: r.vehicle?.name,
      platform: r.platforms.length > 0 ? r.platforms[0].platform.name : undefined,
    })),
    ...expenses.map(e => ({
      id: `exp-${e.id}`,
      description: `Despesa - ${e.expenseTypes.map(et => et.expenseType.name).join(', ')}`,
      category: e.expenseTypes.map(et => et.expenseType.name).join(', '),
      amount: e.amount,
      type: 'expense' as const,
      date: e.date,
      driver: e.driver?.name,
      vehicle: e.vehicle?.name,
      platform: undefined,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20)

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
    growth,
    efficiencyMetrics,
    paymentFees,
    breakdowns: {
      revenueByPlatform: Object.entries(revenueByPlatform)
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
    prisma.platform.findMany({
      where: { userId: userId },
      orderBy: { name: "asc" },
    }),
  ])

  return { drivers, vehicles, platforms: companies }
}

const getCachedDashboardFilterOptions = cacheWithTag(
  getDashboardFilterOptionsUncached,
  ['dashboard-filters'],
  [CacheTags.DRIVERS, CacheTags.VEHICLES, CacheTags.PLATFORMS],
  600
)

export async function getDashboardFilterOptions() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  return getCachedDashboardFilterOptions(user.id)
}

export async function setColumnVisibility(visibility: VisibilityState) {
  const cookieStore = await cookies()
  cookieStore.set("dashboard-column-visibility", JSON.stringify(visibility), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  })
}

export async function getColumnVisibility(): Promise<VisibilityState> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("dashboard-column-visibility")

  if (!cookie?.value) {
    return {}
  }

  try {
    return JSON.parse(cookie.value) as VisibilityState
  } catch {
    return {}
  }
}

async function getMonthlyTrendsDataUncached(
  userId: string,
  filters: Omit<DashboardFilters, 'period'>
) {
  const currentYear = new Date().getFullYear()
  const startDate = new Date(currentYear, 0, 1)
  const endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999)

  const revenues = await prisma.revenue.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
      ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
      ...(filters.platformId && filters.platformId !== "all" && {
        platforms: { some: { platformId: filters.platformId } }
      }),
      OR: [
        { driver: { userId: userId } },
        { platforms: { some: { platform: { userId: userId } } } }
      ],
    },
    select: {
      amount: true,
      date: true,
    },
  })

  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
      ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
      expenseTypes: {
        some: {
          expenseType: {
            userId: userId,
          }
        }
      },
    },
    select: {
      amount: true,
      date: true,
    },
  })

  const monthlyDataMap = new Map<string, { revenue: number; expenses: number }>()

  for (let i = 0; i < 12; i++) {
    const monthKey = format(new Date(currentYear, i, 1), 'yyyy-MM')
    monthlyDataMap.set(monthKey, { revenue: 0, expenses: 0 })
  }

  revenues.forEach(r => {
    const monthKey = format(startOfMonth(r.date), 'yyyy-MM')
    const existing = monthlyDataMap.get(monthKey)
    if (existing) {
      existing.revenue += r.amount
    }
  })

  expenses.forEach(e => {
    const monthKey = format(startOfMonth(e.date), 'yyyy-MM')
    const existing = monthlyDataMap.get(monthKey)
    if (existing) {
      existing.expenses += e.amount
    }
  })

  return Array.from(monthlyDataMap.entries())
    .map(([month, data]) => ({
      month,
      revenue: data.revenue,
      expenses: data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

const getCachedMonthlyTrendsData = cacheWithTag(
  getMonthlyTrendsDataUncached,
  ['monthly-trends-data'],
  [CacheTags.REVENUES, CacheTags.EXPENSES],
  300
)

export async function getMonthlyTrendsData(
  filters: Omit<DashboardFilters, 'period'>
) {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  return getCachedMonthlyTrendsData(user.id, filters)
}

async function getActiveGoalsForDashboardUncached(
  userId: string,
  period: string,
  filters: Omit<DashboardFilters, 'period'>
) {
  const currentDate = new Date()
  const currentMonthPeriod = format(currentDate, 'yyyy-MM')

  const goals = await prisma.goal.findMany({
    where: {
      userId,
      isActive: true,
      ...(filters.driverId && filters.driverId !== "all" && { driverId: filters.driverId }),
      ...(filters.vehicleId && filters.vehicleId !== "all" && { vehicleId: filters.vehicleId }),
    },
  })

  let revenueGoal: number | undefined
  let profitGoal: number | undefined

  if (period === 'thisMonth') {
    const monthlyRevenueGoal = goals.find(
      g => g.type === GoalType.MONTHLY_REVENUE && g.period === currentMonthPeriod
    )
    const monthlyProfitGoal = goals.find(
      g => g.type === GoalType.MONTHLY_PROFIT && g.period === currentMonthPeriod
    )

    revenueGoal = monthlyRevenueGoal?.targetValue
    profitGoal = monthlyProfitGoal?.targetValue
  }

  const budgets = await prisma.budget.findMany({
    where: {
      userId,
      period: currentMonthPeriod,
      isActive: true,
    },
  })

  const budgetTotal = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0)

  return {
    revenueGoal,
    profitGoal,
    budgetTotal: budgetTotal > 0 ? budgetTotal : undefined,
  }
}

const getCachedActiveGoalsForDashboard = cacheWithTag(
  getActiveGoalsForDashboardUncached,
  ['active-goals-dashboard'],
  [CacheTags.DASHBOARD],
  300
)

export async function getActiveGoalsForDashboard(
  period: string,
  filters: Omit<DashboardFilters, 'period'>
) {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  return getCachedActiveGoalsForDashboard(user.id, period, filters)
}
