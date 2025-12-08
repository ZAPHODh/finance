import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getScopedI18n } from "@/locales/server"
import { getBudgetsWithUsage } from "./actions"
import { BudgetsTable } from "@/components/budgets/budgets-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { shouldShowAds } from "@/lib/ads/should-show-ads"
import { BudgetAlertAd } from "@/components/ads/budget-alert-ad"

export default async function BudgetsPage() {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const tBudgets = await getScopedI18n("ui.budgets")
    const budgets = await getBudgetsWithUsage()
    const showAds = await shouldShowAds()

    const budgetsNearLimit = budgets.filter(b => b.usage.shouldAlert)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {tBudgets("title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {tBudgets("description")}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/budgets/new">
                        <Plus className="mr-2 h-4 w-4" />
                        {tBudgets("new")}
                    </Link>
                </Button>
            </div>

            {showAds && budgetsNearLimit.length > 0 && (
                <div className="space-y-4">
                    {budgetsNearLimit.map(budget => (
                        <BudgetAlertAd
                            key={budget.id}
                            budget={budget}
                            currentAmount={budget.usage.spent}
                        />
                    ))}
                </div>
            )}

            <BudgetsTable budgets={budgets} />
        </div>
    )
}
