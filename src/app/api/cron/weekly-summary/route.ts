import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { sendWeeklySummary } from "@/lib/server/mail";
import { getWeekRange } from "@/lib/utils/email-helpers";

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

        const { weekStart, weekEnd } = getWeekRange();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);

        for (const user of users) {
            if (!user.email) continue;

            const [revenues, expenses] = await Promise.all([
                prisma.revenue.findMany({
                    where: {
                        OR: [
                            { platforms: { some: { platform: { userId: user.id } } } },
                            { driver: { userId: user.id } },
                        ],
                        date: {
                            gte: startDate,
                            lt: endDate,
                        },
                    },
                }),
                prisma.expense.findMany({
                    where: {
                        expenseTypes: {
                            some: {
                                expenseType: {
                                    userId: user.id,
                                }
                            }
                        },
                        date: {
                            gte: startDate,
                            lt: endDate,
                        },
                    },
                }),
            ]);

            const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
            const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
            const profit = totalRevenue - totalExpenses;

            if (totalRevenue > 0 || totalExpenses > 0) {
                await sendWeeklySummary({
                    toMail: user.email,
                    userName: user.name || "User",
                    weekStart,
                    weekEnd,
                    totalRevenue,
                    totalExpenses,
                    profit,
                    currency: user.preferences?.currency.toUpperCase() || "BRL",
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Weekly summaries sent to ${users.length} users`,
        });
    } catch (error) {
        console.error("Weekly summary cron error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
