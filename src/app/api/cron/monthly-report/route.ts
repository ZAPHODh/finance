import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { sendMonthlyReport } from "@/lib/server/mail";
import { getCurrentMonthName, getCurrentYear } from "@/lib/utils/email-helpers";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                emailVerified: true,
                email: { not: null },
                preferences: {
                    emailNotifications: true,
                },
            },
            include: {
                preferences: true,
            },
        });

        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        const endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        for (const user of users) {
            if (!user.email) continue;

            const locale = user.preferences?.language || "pt";

            const [revenues, expenses] = await Promise.all([
                prisma.revenue.findMany({
                    where: {
                        OR: [
                            { platforms: { some: { platform: { userId: user.id } } } },
                            { driver: { userId: user.id } },
                        ],
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                }),
                prisma.expense.findMany({
                    where: {
                        expenseType: { userId: user.id },
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    include: {
                        expenseType: true,
                    },
                }),
            ]);

            const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
            const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
            const profit = totalRevenue - totalExpenses;

            const expensesByType = expenses.reduce((acc, expense) => {
                const typeName = expense.expenseType.name;
                acc[typeName] = (acc[typeName] || 0) + expense.amount;
                return acc;
            }, {} as Record<string, number>);

            const topExpenseEntry = Object.entries(expensesByType).sort(
                ([, a], [, b]) => b - a
            )[0];

            const topExpenseCategory = topExpenseEntry?.[0] || "N/A";
            const topExpenseAmount = topExpenseEntry?.[1] || 0;

            const uniqueDates = new Set(
                [...revenues, ...expenses].map((item) =>
                    item.date.toISOString().split("T")[0]
                )
            );
            const daysWorked = uniqueDates.size;

            if (totalRevenue > 0 || totalExpenses > 0) {
                await sendMonthlyReport({
                    toMail: user.email,
                    userName: user.name || "User",
                    month: getCurrentMonthName(locale),
                    year: getCurrentYear(),
                    totalRevenue,
                    totalExpenses,
                    profit,
                    topExpenseCategory,
                    topExpenseAmount,
                    daysWorked,
                    currency: user.preferences?.currency.toUpperCase() || "BRL",
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Monthly reports sent to ${users.length} users`,
        });
    } catch (error) {
        console.error("Monthly report cron error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
