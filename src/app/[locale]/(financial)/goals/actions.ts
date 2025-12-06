"use server"

import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { GoalType } from "@prisma/client"
import { checkIfGoalLimitReached } from "@/lib/plans/plan-checker"
import { z } from "zod"
import type { GoalFormData, UpdateGoalData } from "@/types/forms"
import { createMonetaryAmountSchema, createPeriodSchema } from "@/lib/validations/common"

const goalFormSchema = z.object({
    name: z.string().optional(),
    type: z.nativeEnum(GoalType),
    targetValue: createMonetaryAmountSchema({ max: 10000000, errorMessage: "Target value must be positive" }),
    period: createPeriodSchema("Period must be in YYYY-MM format"),
    driverId: z.string().optional(),
    vehicleId: z.string().optional(),
});

const updateGoalSchema = z.object({
    name: z.string().optional(),
    targetValue: createMonetaryAmountSchema({ max: 10000000 }).optional(),
    period: createPeriodSchema().optional(),
    driverId: z.string().optional(),
    vehicleId: z.string().optional(),
    isActive: z.boolean().optional(),
});


export async function getGoals() {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const goals = await prisma.goal.findMany({
        where: { userId: user.id },
        include: {
            driver: {
                select: { id: true, name: true },
            },
            vehicle: {
                select: { id: true, name: true },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    return goals
}

/**
 * Get a single goal by ID
 */
export async function getGoalById(id: string) {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const goal = await prisma.goal.findFirst({
        where: {
            id,
            userId: user.id,
        },
        include: {
            driver: {
                select: { id: true, name: true },
            },
            vehicle: {
                select: { id: true, name: true },
            },
        },
    })

    return goal
}

export async function createGoal(input: GoalFormData) {
    const data = goalFormSchema.parse(input);
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error("Unauthorized")
    }


    const limitReached = await checkIfGoalLimitReached()
    if (limitReached) {
        throw new Error("Você atingiu o limite de metas do seu plano. Faça upgrade para adicionar mais.")
    }

    await prisma.goal.create({
        data: {
            userId: user.id,
            name: data.name,
            type: data.type,
            targetValue: data.targetValue,
            period: data.period,
            driverId: data.driverId,
            vehicleId: data.vehicleId,
        },
    })

    revalidatePath("/goals")
}


export async function updateGoal(id: string, input: UpdateGoalData) {
    const data = updateGoalSchema.parse(input);
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error("Unauthorized")
    }


    const existing = await prisma.goal.findFirst({
        where: {
            id,
            userId: user.id,
        },
    })

    if (!existing) {
        throw new Error("Goal not found")
    }

    await prisma.goal.update({
        where: { id },
        data: {
            name: data.name,
            targetValue: data.targetValue,
            period: data.period,
            driverId: data.driverId,
            vehicleId: data.vehicleId,
            isActive: data.isActive,
        },
    })

    revalidatePath("/goals")
}


export async function deleteGoal(id: string) {
    const idSchema = z.string().min(1);
    idSchema.parse(id);
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error("Unauthorized")
    }

    const existing = await prisma.goal.findFirst({
        where: {
            id,
            userId: user.id,
        },
    })

    if (!existing) {
        throw new Error("Goal not found")
    }

    await prisma.goal.delete({
        where: { id },
    })

    revalidatePath("/goals")
}

/**
 * Toggle goal active status
 */
export async function toggleGoalActive(id: string) {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const goal = await prisma.goal.findFirst({
        where: {
            id,
            userId: user.id,
        },
    })

    if (!goal) {
        throw new Error("Goal not found")
    }

    await prisma.goal.update({
        where: { id },
        data: {
            isActive: !goal.isActive,
        },
    })

    revalidatePath("/goals")
}

/**
 * Get goal progress
 */
export async function getGoalProgress(goalId: string) {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const goal = await prisma.goal.findFirst({
        where: {
            id: goalId,
            userId: user.id,
        },
    })

    if (!goal) {
        throw new Error("Goal not found")
    }


    let currentValue = 0


    const period = goal.period
    let startDate: Date
    let endDate: Date

    if (period.length === 10) {

        startDate = new Date(period)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(period)
        endDate.setHours(23, 59, 59, 999)
    } else if (period.length === 7) {

        const [year, month] = period.split("-").map(Number)
        startDate = new Date(year, month - 1, 1)
        endDate = new Date(year, month, 0, 23, 59, 59, 999)
    } else {
        throw new Error("Invalid period format")
    }

    const whereClause: {
        date: { gte: Date; lte: Date };
        driverId?: string;
        vehicleId?: string;
    } = {
        date: {
            gte: startDate,
            lte: endDate,
        },
    }

    if (goal.driverId) {
        whereClause.driverId = goal.driverId
    }

    if (goal.vehicleId) {
        whereClause.vehicleId = goal.vehicleId
    }

    switch (goal.type) {
        case "DAILY_REVENUE":
        case "WEEKLY_REVENUE":
        case "MONTHLY_REVENUE": {
            const revenues = await prisma.revenue.findMany({
                where: {
                    ...whereClause,
                    driver: {
                        userId: user.id,
                    },
                },
            })
            currentValue = revenues.reduce((sum, r) => sum + r.amount, 0)
            break
        }

        case "MONTHLY_PROFIT": {
            const [revenues, expenses] = await Promise.all([
                prisma.revenue.findMany({
                    where: {
                        ...whereClause,
                        driver: { userId: user.id },
                    },
                }),
                prisma.expense.findMany({
                    where: {
                        ...whereClause,
                        driver: { userId: user.id },
                    },
                }),
            ])
            const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0)
            const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
            currentValue = totalRevenue - totalExpenses
            break
        }

        case "MONTHLY_KM": {
            const [revenues, workLogs] = await Promise.all([
                prisma.revenue.findMany({
                    where: {
                        ...whereClause,
                        driver: { userId: user.id },
                    },
                }),
                prisma.workLog.findMany({
                    where: {
                        ...whereClause,
                        driver: { userId: user.id },
                    },
                }),
            ])
            currentValue = [...revenues, ...workLogs].reduce(
                (sum, item) => sum + (item.kmDriven || 0),
                0
            )
            break
        }

        case "MONTHLY_HOURS": {
            const [revenues, workLogs] = await Promise.all([
                prisma.revenue.findMany({
                    where: {
                        ...whereClause,
                        driver: { userId: user.id },
                    },
                }),
                prisma.workLog.findMany({
                    where: {
                        ...whereClause,
                        driver: { userId: user.id },
                    },
                }),
            ])
            currentValue = [...revenues, ...workLogs].reduce(
                (sum, item) => sum + ("hoursWorked" in item ? item.hoursWorked || 0 : 0),
                0
            )
            break
        }
    }

    const percentage = (currentValue / goal.targetValue) * 100

    return {
        goal,
        currentValue,
        targetValue: goal.targetValue,
        percentage: Math.min(percentage, 100),
        achieved: currentValue >= goal.targetValue,
    }
}
