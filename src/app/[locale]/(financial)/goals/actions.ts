"use server"

import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authActionClient } from "@/lib/client/safe-action"
import { GoalType } from "@prisma/client"
import { PLAN_LIMITS } from "@/config/subscription"

async function checkIfGoalLimitReached() {
    const { user } = await getCurrentSession()
    if (!user) throw new Error("Unauthorized")

    const userWithPlan = await prisma.user.findUnique({
        where: { id: user.id },
        select: { planType: true },
    })

    if (!userWithPlan) throw new Error("User not found")

    const limits = PLAN_LIMITS[userWithPlan.planType]
    if (limits.maxGoals === -1) return false

    const count = await prisma.goal.count({
        where: { userId: user.id, isActive: true },
    })

    return count >= limits.maxGoals
}

const createGoalSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    type: z.nativeEnum(GoalType),
    targetValue: z.number().positive("Target value must be positive"),
    period: z.string().min(1, "Period is required"),
    driverId: z.string().optional(),
    vehicleId: z.string().optional(),
})

const updateGoalSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required").optional(),
    targetValue: z.number().positive("Target value must be positive").optional(),
    period: z.string().min(1, "Period is required").optional(),
    driverId: z.string().optional(),
    vehicleId: z.string().optional(),
    isActive: z.boolean().optional(),
})

const deleteGoalSchema = z.object({
    id: z.string(),
})

// ============================================
// Server Actions
// ============================================

/**
 * Get all user goals
 */
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

/**
 * Create a new goal
 */
export const createGoal = authActionClient
    .metadata({ actionName: "createGoal" })
    .schema(createGoalSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx

        // Check if limit is reached
        const limitReached = await checkIfGoalLimitReached()
        if (limitReached) {
            throw new Error("You have reached the maximum number of goals for your plan. Please upgrade to add more.")
        }

        const goal = await prisma.goal.create({
            data: {
                userId: user.id,
                name: parsedInput.name,
                type: parsedInput.type,
                targetValue: parsedInput.targetValue,
                period: parsedInput.period,
                driverId: parsedInput.driverId,
                vehicleId: parsedInput.vehicleId,
            },
        })

        revalidatePath("/goals")
        return goal
    })

/**
 * Update a goal
 */
export const updateGoal = authActionClient
    .metadata({ actionName: "updateGoal" })
    .schema(updateGoalSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx

        // Verify ownership
        const existing = await prisma.goal.findFirst({
            where: {
                id: parsedInput.id,
                userId: user.id,
            },
        })

        if (!existing) {
            throw new Error("Goal not found")
        }

        const goal = await prisma.goal.update({
            where: { id: parsedInput.id },
            data: {
                name: parsedInput.name,
                targetValue: parsedInput.targetValue,
                period: parsedInput.period,
                driverId: parsedInput.driverId,
                vehicleId: parsedInput.vehicleId,
                isActive: parsedInput.isActive,
            },
        })

        revalidatePath("/goals")
        return goal
    })

/**
 * Delete a goal
 */
export const deleteGoal = authActionClient
    .metadata({ actionName: "deleteGoal" })
    .schema(deleteGoalSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx

        // Verify ownership
        const existing = await prisma.goal.findFirst({
            where: {
                id: parsedInput.id,
                userId: user.id,
            },
        })

        if (!existing) {
            throw new Error("Goal not found")
        }

        await prisma.goal.delete({
            where: { id: parsedInput.id },
        })

        revalidatePath("/goals")
        return { success: true }
    })

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

    // Calculate progress based on goal type
    let currentValue = 0

    // Parse period to get date range
    const period = goal.period
    let startDate: Date
    let endDate: Date

    if (period.length === 10) {
        // Daily format: YYYY-MM-DD
        startDate = new Date(period)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(period)
        endDate.setHours(23, 59, 59, 999)
    } else if (period.length === 7) {
        // Monthly format: YYYY-MM
        const [year, month] = period.split("-").map(Number)
        startDate = new Date(year, month - 1, 1)
        endDate = new Date(year, month, 0, 23, 59, 59, 999)
    } else {
        throw new Error("Invalid period format")
    }

    const whereClause: any = {
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
            const [revenues, expenses, workLogs] = await Promise.all([
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
