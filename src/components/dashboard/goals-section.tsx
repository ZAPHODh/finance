"use client"

import { useEffect, useState } from "react"
import { GoalProgressCard } from "@/components/goals/goal-progress-card"
import { getGoals, getGoalProgress } from "@/app/[locale]/(financial)/goals/actions"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useScopedI18n } from "@/locales/client"

export function GoalsSection() {
    const t = useScopedI18n("shared.goals")
    const [goalsWithProgress, setGoalsWithProgress] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchGoals() {
            try {
                const goals = await getGoals()
                const activeGoals = goals.filter((g) => g.isActive).slice(0, 3)

                const goalsProgress = await Promise.all(
                    activeGoals.map(async (goal) => {
                        const progress = await getGoalProgress(goal.id)
                        return progress
                    })
                )

                setGoalsWithProgress(goalsProgress)
            } catch (error) {
                console.error("Error fetching goals:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchGoals()
    }, [])

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-40 animate-pulse rounded-lg border bg-muted"
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (goalsWithProgress.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
                    <Button asChild size="sm">
                        <Link href="/goals/new">
                            <Plus className="mr-2 h-4 w-4" />
                            {t("new")}
                        </Link>
                    </Button>
                </div>
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground mb-4">{t("noGoals")}</p>
                    <Button asChild>
                        <Link href="/goals/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Criar primeira meta
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/goals">
                        Ver todas
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {goalsWithProgress.map((item) => (
                    <GoalProgressCard
                        key={item.goal.id}
                        goal={item.goal}
                        progress={{
                            currentValue: item.currentValue,
                            percentage: item.percentage,
                            achieved: item.achieved,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
