"use server"

import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { PLAN_LIMITS } from "@/config/subscription"

export async function hasFeature(feature: keyof typeof PLAN_LIMITS.FREE): Promise<boolean> {
    const { user } = await getCurrentSession()
    if (!user) return false

    const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: { planType: true },
    })

    if (!userData) return false

    const limits = PLAN_LIMITS[userData.planType]

    return Boolean(limits[feature])
}

export async function getUserUsageAndLimits() {
    const { user } = await getCurrentSession()
    if (!user) throw new Error("Unauthorized")

    const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            planType: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            storageUsed: true,
            monthlyExportCount: true,
        },
    })

    if (!userData) throw new Error("User not found")

    const limits = PLAN_LIMITS[userData.planType]

    const [
        driversCount,
        vehiclesCount,
        companiesCount,
        expenseTypesCount,
        revenueTypesCount,
        paymentMethodsCount,
        goalsCount,
        budgetsCount,
    ] = await Promise.all([
        prisma.driver.count({ where: { userId: user.id } }),
        prisma.vehicle.count({ where: { userId: user.id } }),
        prisma.company.count({ where: { userId: user.id } }),
        prisma.expenseType.count({ where: { userId: user.id } }),
        prisma.revenueType.count({ where: { userId: user.id } }),
        prisma.paymentMethod.count({ where: { userId: user.id } }),
        prisma.goal.count({ where: { userId: user.id, isActive: true } }),
        prisma.budget.count({ where: { userId: user.id, isActive: true } }),
    ])

    const storageUsedGB = Number(userData.storageUsed) / (1024 ** 3)

    return {
        plan: {
            planType: userData.planType,
            isPro: userData.planType === "PRO",
            isSimple: userData.planType === "SIMPLE",
            isFree: userData.planType === "FREE",
            stripeCustomerId: userData.stripeCustomerId,
            stripeSubscriptionId: userData.stripeSubscriptionId,
            stripeCurrentPeriodEnd: userData.stripeCurrentPeriodEnd,
        },
        usage: {
            drivers: driversCount,
            vehicles: vehiclesCount,
            companies: companiesCount,
            expenseTypes: expenseTypesCount,
            revenueTypes: revenueTypesCount,
            paymentMethods: paymentMethodsCount,
            goals: goalsCount,
            budgets: budgetsCount,
            exports: userData.monthlyExportCount,
            storageGB: storageUsedGB,
        },
        limits: {
            drivers: limits.maxDrivers,
            vehicles: limits.maxVehicles,
            companies: limits.maxCompanies,
            expenseTypes: limits.maxExpenseTypes,
            revenueTypes: limits.maxRevenueTypes,
            paymentMethods: limits.maxPaymentMethods,
            goals: limits.maxGoals,
            budgets: limits.maxBudgets,
            exports: limits.maxExportsPerMonth,
            storageGB: limits.storageGB,
        },
        features: {
            hasExports: limits.hasExports,
            hasAdvancedInsights: limits.hasAdvancedInsights,
            hasAttachments: limits.hasAttachments,
            hasOCR: limits.hasOCR,
            hasReports: limits.hasReports,
            hasReminders: limits.hasReminders,
            hasMultiUser: limits.hasMultiUser,
            hasAPIAccess: limits.hasAPIAccess,
        },
    }
}

export async function checkIfExportLimitReached() {
    const { user } = await getCurrentSession()
    if (!user) throw new Error("Unauthorized")

    const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            planType: true,
            monthlyExportCount: true,
            exportCountResetAt: true,
        },
    })

    if (!userData) throw new Error("User not found")

    const limits = PLAN_LIMITS[userData.planType]

    if (!limits.hasExports) return true
    if (limits.maxExportsPerMonth === -1) return false

    const now = new Date()
    if (!userData.exportCountResetAt || userData.exportCountResetAt < now) {
        const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                monthlyExportCount: 0,
                exportCountResetAt: nextReset,
            },
        })
        return false
    }

    return userData.monthlyExportCount >= limits.maxExportsPerMonth
}

export async function incrementExportCounter() {
    const { user } = await getCurrentSession()
    if (!user) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: user.id },
        data: {
            monthlyExportCount: { increment: 1 },
        },
    })
}
