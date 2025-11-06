import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getScopedI18n } from "@/locales/server"
import { BudgetForm } from "@/components/budgets/budget-form"
import { prisma } from "@/lib/server/db"

export default async function NewBudgetPage() {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const tBudgets = await getScopedI18n("ui.budgets")

    const expenseTypes = await prisma.expenseType.findMany({
        where: { userId: user.id },
        select: { id: true, name: true, },
        orderBy: { name: "asc" },
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {tBudgets("new")}
                </h1>
                <p className="text-muted-foreground">
                    {tBudgets("newDescription")}
                </p>
            </div>

            <BudgetForm expenseTypes={expenseTypes} />
        </div>
    )
}
