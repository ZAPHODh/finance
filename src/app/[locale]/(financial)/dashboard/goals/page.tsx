import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getScopedI18n } from "@/locales/server"
import { getGoals } from "./actions"
import { GoalsTable } from "@/components/goals/goals-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function GoalsPage() {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const tGoals = await getScopedI18n("ui.goals")
    const goals = await getGoals()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {tGoals("title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {tGoals("description")}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/goals/new">
                        <Plus className="mr-2 h-4 w-4" />
                        {tGoals("new")}
                    </Link>
                </Button>
            </div>

            <GoalsTable goals={goals} />
        </div>
    )
}
