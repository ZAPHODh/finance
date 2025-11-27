"use server"

import { getCurrentSession } from "@/lib/server/auth/session";
import { prisma } from "@/lib/server/db";
import { sendBudgetAlert, sendGoalAchievement } from "@/lib/server/mail";
import { formatCurrency } from "@/lib/utils/email-helpers";

export async function checkBudgetAlerts() {
    const { user } = await getCurrentSession();
    if (!user) return;

    const preferences = await prisma.userPreferences.findUnique({
        where: { userId: user.id },
    });

    if (!preferences?.emailNotifications) return;

    const currentPeriod = new Date().toISOString().slice(0, 7);

    const budgets = await prisma.budget.findMany({
        where: {
            userId: user.id,
            isActive: true,
            period: currentPeriod,
        },
        include: {
            expenseType: true,
        },
    });

    for (const budget of budgets) {
        const expenses = await prisma.expense.findMany({
            where: {
                expenseTypes: {
                    some: {
                        expenseTypeId: budget.expenseTypeId,
                    }
                },
                date: {
                    gte: new Date(`${currentPeriod}-01`),
                    lt: new Date(new Date(`${currentPeriod}-01`).setMonth(new Date(`${currentPeriod}-01`).getMonth() + 1)),
                },
            },
        });

        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const percentage = (totalSpent / budget.monthlyLimit) * 100;

        if (percentage >= budget.alertThreshold * 100) {
            const existingAlert = await prisma.alert.findFirst({
                where: {
                    userId: user.id,
                    type: percentage >= 100 ? "BUDGET_EXCEEDED" : "BUDGET_WARNING",
                    metadata: {
                        path: ["budgetId"],
                        equals: budget.id,
                    },
                    isSent: true,
                    createdAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                },
            });

            if (!existingAlert && user.email) {
                await sendBudgetAlert({
                    toMail: user.email,
                    userName: user.name || "User",
                    budgetName: budget.name || budget.expenseType.name,
                    currentAmount: totalSpent,
                    limitAmount: budget.monthlyLimit,
                    percentage,
                    currency: preferences.currency.toUpperCase(),
                });

                await prisma.alert.create({
                    data: {
                        userId: user.id,
                        type: percentage >= 100 ? "BUDGET_EXCEEDED" : "BUDGET_WARNING",
                        title: `Budget alert: ${budget.name || budget.expenseType.name}`,
                        message: `Your budget has reached ${percentage.toFixed(0)}%`,
                        metadata: {
                            budgetId: budget.id,
                            percentage,
                            totalSpent,
                            limit: budget.monthlyLimit,
                        },
                        isSent: true,
                    },
                });
            }
        }
    }
}

export async function checkGoalAchievements() {
    const { user } = await getCurrentSession();
    if (!user) return;

    const preferences = await prisma.userPreferences.findUnique({
        where: { userId: user.id },
    });

    if (!preferences?.emailNotifications) return;

    const currentPeriod = new Date().toISOString().slice(0, 7);

    const goals = await prisma.goal.findMany({
        where: {
            userId: user.id,
            isActive: true,
            period: currentPeriod,
            type: {
                in: ["MONTHLY_REVENUE", "MONTHLY_PROFIT"],
            },
        },
        include: {
            driver: true,
            vehicle: true,
        },
    });

    for (const goal of goals) {
        const startDate = new Date(`${currentPeriod}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const revenues = await prisma.revenue.findMany({
            where: {
                driverId: goal.driverId || undefined,
                vehicleId: goal.vehicleId || undefined,
                date: {
                    gte: startDate,
                    lt: endDate,
                },
            },
        });

        const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);

        let currentValue = totalRevenue;

        if (goal.type === "MONTHLY_PROFIT") {
            const expenses = await prisma.expense.findMany({
                where: {
                    driverId: goal.driverId || undefined,
                    vehicleId: goal.vehicleId || undefined,
                    date: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
            });

            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            currentValue = totalRevenue - totalExpenses;
        }

        if (currentValue >= goal.targetValue) {
            const existingAlert = await prisma.alert.findFirst({
                where: {
                    userId: user.id,
                    type: "GOAL_PROGRESS",
                    metadata: {
                        path: ["goalId"],
                        equals: goal.id,
                    },
                    isSent: true,
                },
            });

            if (!existingAlert && user.email) {
                await sendGoalAchievement({
                    toMail: user.email,
                    userName: user.name || "User",
                    goalName: goal.name || `${goal.type} Goal`,
                    targetValue: goal.targetValue,
                    currentValue,
                    currency: preferences.currency.toUpperCase(),
                });

                await prisma.alert.create({
                    data: {
                        userId: user.id,
                        type: "GOAL_PROGRESS",
                        title: `Goal achieved: ${goal.name || goal.type}`,
                        message: `Congratulations! You've reached your goal of ${formatCurrency(goal.targetValue, preferences.currency.toUpperCase())}`,
                        metadata: {
                            goalId: goal.id,
                            targetValue: goal.targetValue,
                            currentValue,
                        },
                        isSent: true,
                    },
                });
            }
        }
    }
}
