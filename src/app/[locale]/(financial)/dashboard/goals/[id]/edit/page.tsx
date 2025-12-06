import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getScopedI18n } from "@/locales/server"
import { GoalForm } from "@/components/goals/goal-form"
import { prisma } from "@/lib/server/db"
import { getGoalById } from "../../actions"

export default async function EditGoalPage({ params }: { params: { id: string } }) {
    const { user } = await getCurrentSession()
    if (!user) redirect("/login")

    const tGoals = await getScopedI18n("ui.goals")

    const goal = await getGoalById(params.id)
    if (!goal) redirect("/dashboard/goals")

    const [drivers, vehicles] = await Promise.all([
        prisma.driver.findMany({
            where: { userId: user.id },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
        prisma.vehicle.findMany({
            where: { userId: user.id },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {tGoals("edit")}
                </h1>
                <p className="text-muted-foreground">
                    Update your financial goal
                </p>
            </div>

            <GoalForm drivers={drivers} vehicles={vehicles} goal={goal} />
        </div>
    )
}
