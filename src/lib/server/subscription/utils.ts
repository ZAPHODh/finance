"use server"

import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { type PlanType } from "@prisma/client"
import { PLAN_LIMITS } from "@/config/subscription"

export interface UserSubscriptionPlan {
    planType: PlanType
    isPro: boolean
    isSimple: boolean
    isFree: boolean
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripeCurrentPeriodEnd: Date | null
}

export async function getUserSubscriptionPlan(userId: string): Promise<UserSubscriptionPlan> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            planType: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
        },
    })

    if (!user) {
        throw new Error("User not found")
    }

    return {
        planType: user.planType,
        isPro: user.planType === "PRO",
        isSimple: user.planType === "SIMPLE",
        isFree: user.planType === "FREE",
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
    }
}

export async function hasFeature(feature: keyof typeof PLAN_LIMITS.FREE): Promise<boolean> {
    const { user } = await getCurrentSession()
    if (!user) return false

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)
    const limits = PLAN_LIMITS[subscriptionPlan.planType]

    return Boolean(limits[feature])
}

export async function getUserUsageAndLimits() {
    const { user } = await getCurrentSession()
    if (!user) throw new Error("Unauthorized")

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)
    const limits = PLAN_LIMITS[subscriptionPlan.planType]

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

    const userStorage = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            storageUsed: true,
            monthlyExportCount: true,
        },
    })

    const storageUsedGB = userStorage ? Number(userStorage.storageUsed) / (1024 ** 3) : 0

    return {
        plan: subscriptionPlan,
        usage: {
            drivers: driversCount,
            vehicles: vehiclesCount,
            companies: companiesCount,
            expenseTypes: expenseTypesCount,
            revenueTypes: revenueTypesCount,
            paymentMethods: paymentMethodsCount,
            goals: goalsCount,
            budgets: budgetsCount,
            exports: userStorage?.monthlyExportCount || 0,
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

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    const limits = PLAN_LIMITS[subscriptionPlan.planType]

    if (!limits.hasExports) return true
    if (limits.maxExportsPerMonth === -1) return false

    const userWithCount = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            monthlyExportCount: true,
            exportCountResetAt: true,
        },
    })

    if (!userWithCount) return true

    const now = new Date()
    if (!userWithCount.exportCountResetAt || userWithCount.exportCountResetAt < now) {
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

    return userWithCount.monthlyExportCount >= limits.maxExportsPerMonth
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
