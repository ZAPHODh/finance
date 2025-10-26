"use server"

import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { PLAN_LIMITS } from "@/config/subscription"

async function checkIfBudgetLimitReached() {
    const { user } = await getCurrentSession()
    if (!user) throw new Error("Unauthorized")

    const userWithPlan = await prisma.user.findUnique({
        where: { id: user.id },
        select: { planType: true },
    })

    if (!userWithPlan) throw new Error("User not found")

    const limits = PLAN_LIMITS[userWithPlan.planType]
    if (limits.maxBudgets === -1) return false

    const count = await prisma.budget.count({
        where: { userId: user.id, isActive: true },
    })

    return count >= limits.maxBudgets
}

export interface BudgetFormData {
    name?: string;
    expenseTypeId: string;
    monthlyLimit: number;
    alertThreshold: number;
    period: string;
}

export interface UpdateBudgetData {
    name?: string;
    expenseTypeId?: string;
    monthlyLimit?: number;
    alertThreshold?: number;
    period?: string;
    isActive?: boolean;
}

// ============================================
// Server Actions
// ============================================

/**
 * Get all user budgets
 */
export async function getBudgets() {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const budgets = await prisma.budget.findMany({
        where: { userId: user.id },
        include: {
            expenseType: {
                select: { id: true, name: true, icon: true },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    return budgets
}

/**
 * Get a single budget by ID
 */
export async function getBudgetById(id: string) {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const budget = await prisma.budget.findFirst({
        where: {
            id,
            userId: user.id,
        },
        include: {
            expenseType: {
                select: { id: true, name: true, icon: true },
            },
        },
    })

    return budget
}

/**
 * Create a new budget
 */
export async function createBudget(data: BudgetFormData) {
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error("Unauthorized")
    }

    // Check if limit is reached
    const limitReached = await checkIfBudgetLimitReached()
    if (limitReached) {
        throw new Error("You have reached the maximum number of budgets for your plan. Please upgrade to add more.")
    }

    const budget = await prisma.budget.create({
        data: {
            userId: user.id,
            name: data.name,
            expenseTypeId: data.expenseTypeId,
            monthlyLimit: data.monthlyLimit,
            alertThreshold: data.alertThreshold ?? 0.8,
            period: data.period,
        },
    })

    revalidatePath("/budgets")
}

/**
 * Update a budget
 */
export async function updateBudget(id: string, data: UpdateBudgetData) {
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error("Unauthorized")
    }

    // Verify ownership
    const existing = await prisma.budget.findFirst({
        where: {
            id,
            userId: user.id,
        },
    })

    if (!existing) {
        throw new Error("Budget not found")
    }

    const budget = await prisma.budget.update({
        where: { id },
        data: {
            name: data.name,
            expenseTypeId: data.expenseTypeId,
            monthlyLimit: data.monthlyLimit,
            alertThreshold: data.alertThreshold,
            period: data.period,
            isActive: data.isActive,
        },
    })

    revalidatePath("/budgets")
}

/**
 * Delete a budget
 */
export async function deleteBudget(id: string) {
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error("Unauthorized")
    }

    // Verify ownership
    const existing = await prisma.budget.findFirst({
        where: {
            id,
            userId: user.id,
        },
    })

    if (!existing) {
        throw new Error("Budget not found")
    }

    await prisma.budget.delete({
        where: { id },
    })

    revalidatePath("/budgets")
}

/**
 * Toggle budget active status
 */
export async function toggleBudgetActive(id: string) {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const budget = await prisma.budget.findFirst({
        where: {
            id,
            userId: user.id,
        },
    })

    if (!budget) {
        throw new Error("Budget not found")
    }

    await prisma.budget.update({
        where: { id },
        data: {
            isActive: !budget.isActive,
        },
    })

    revalidatePath("/budgets")
}

/**
 * Get budget usage
 */
export async function getBudgetUsage(budgetId: string) {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const budget = await prisma.budget.findFirst({
        where: {
            id: budgetId,
            userId: user.id,
        },
        include: {
            expenseType: true,
        },
    })

    if (!budget) {
        throw new Error("Budget not found")
    }

    // Parse period to get date range
    const [year, month] = budget.period.split("-").map(Number)
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)

    const expenses = await prisma.expense.findMany({
        where: {
            expenseTypeId: budget.expenseTypeId,
            date: {
                gte: startDate,
                lte: endDate,
            },
            driver: {
                userId: user.id,
            },
        },
    })

    const spent = expenses.reduce((sum, e) => sum + e.amount, 0)
    const remaining = budget.monthlyLimit - spent
    const percentage = (spent / budget.monthlyLimit) * 100
    const exceeded = spent > budget.monthlyLimit
    const warningThreshold = budget.monthlyLimit * budget.alertThreshold

    return {
        budget,
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        exceeded,
        shouldAlert: spent >= warningThreshold,
    }
}

/**
 * Get all budgets with usage
 */
export async function getBudgetsWithUsage() {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const budgets = await getBudgets()

    const budgetsWithUsage = await Promise.all(
        budgets.map(async (budget) => {
            const usage = await getBudgetUsage(budget.id)
            return {
                ...budget,
                usage,
            }
        })
    )

    return budgetsWithUsage
}
