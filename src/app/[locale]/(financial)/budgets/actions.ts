"use server"

import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authActionClient } from "@/lib/client/safe-action"
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

const createBudgetSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    expenseTypeId: z.string().min(1, "Expense type is required"),
    monthlyLimit: z.number().positive("Monthly limit must be positive"),
    alertThreshold: z.number().min(0).max(1).default(0.8),
    period: z.string().min(1, "Period is required"),
})

const updateBudgetSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required").optional(),
    expenseTypeId: z.string().min(1, "Expense type is required").optional(),
    monthlyLimit: z.number().positive("Monthly limit must be positive").optional(),
    alertThreshold: z.number().min(0).max(1).optional(),
    period: z.string().min(1, "Period is required").optional(),
    isActive: z.boolean().optional(),
})

const deleteBudgetSchema = z.object({
    id: z.string(),
})

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
export const createBudget = authActionClient
    .metadata({ actionName: "createBudget" })
    .schema(createBudgetSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx

        // Check if limit is reached
        const limitReached = await checkIfBudgetLimitReached()
        if (limitReached) {
            throw new Error("You have reached the maximum number of budgets for your plan. Please upgrade to add more.")
        }

        const budget = await prisma.budget.create({
            data: {
                userId: user.id,
                name: parsedInput.name,
                expenseTypeId: parsedInput.expenseTypeId,
                monthlyLimit: parsedInput.monthlyLimit,
                alertThreshold: parsedInput.alertThreshold,
                period: parsedInput.period,
            },
        })

        revalidatePath("/budgets")
        return budget
    })

/**
 * Update a budget
 */
export const updateBudget = authActionClient
    .metadata({ actionName: "updateBudget" })
    .schema(updateBudgetSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx

        // Verify ownership
        const existing = await prisma.budget.findFirst({
            where: {
                id: parsedInput.id,
                userId: user.id,
            },
        })

        if (!existing) {
            throw new Error("Budget not found")
        }

        const budget = await prisma.budget.update({
            where: { id: parsedInput.id },
            data: {
                name: parsedInput.name,
                expenseTypeId: parsedInput.expenseTypeId,
                monthlyLimit: parsedInput.monthlyLimit,
                alertThreshold: parsedInput.alertThreshold,
                period: parsedInput.period,
                isActive: parsedInput.isActive,
            },
        })

        revalidatePath("/budgets")
        return budget
    })

/**
 * Delete a budget
 */
export const deleteBudget = authActionClient
    .metadata({ actionName: "deleteBudget" })
    .schema(deleteBudgetSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx

        // Verify ownership
        const existing = await prisma.budget.findFirst({
            where: {
                id: parsedInput.id,
                userId: user.id,
            },
        })

        if (!existing) {
            throw new Error("Budget not found")
        }

        await prisma.budget.delete({
            where: { id: parsedInput.id },
        })

        revalidatePath("/budgets")
        return { success: true }
    })

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
