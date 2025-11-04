"use server"

import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { checkIfBudgetLimitReached } from "@/lib/plans/plan-checker"
import { z } from "zod"

const budgetFormSchema = z.object({
    name: z.string().optional(),
    expenseTypeId: z.string().min(1, "Expense type is required"),
    monthlyLimit: z.number().positive("Monthly limit must be positive"),
    alertThreshold: z.number().min(0).max(1),
    period: z.string().min(1, "Period is required"),
});

const updateBudgetSchema = z.object({
    name: z.string().optional(),
    expenseTypeId: z.string().optional(),
    monthlyLimit: z.number().positive().optional(),
    alertThreshold: z.number().min(0).max(1).optional(),
    period: z.string().optional(),
    isActive: z.boolean().optional(),
});

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

export async function getBudgets() {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const budgets = await prisma.budget.findMany({
        where: { userId: user.id },
        include: {
            expenseType: {
                select: { id: true, name: true },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    return budgets
}


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
                select: { id: true, name: true, },
            },
        },
    })

    return budget
}


export async function createBudget(input: unknown) {
    const data = budgetFormSchema.parse(input);
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error("Unauthorized")
    }


    const limitReached = await checkIfBudgetLimitReached()
    if (limitReached) {
        throw new Error("Você atingiu o limite de orçamentos do seu plano. Faça upgrade para adicionar mais.")
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


export async function updateBudget(id: string, input: unknown) {
    const data = updateBudgetSchema.parse(input);
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error("Unauthorized")
    }

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


export async function deleteBudget(id: string) {
    const idSchema = z.string().min(1);
    idSchema.parse(id);
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error("Unauthorized")
    }

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
