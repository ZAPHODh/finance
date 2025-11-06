"use client"

import { useScopedI18n } from "@/locales/client"
import { DataTable } from "@/components/ui/data-table/data-table"
import { createGoalsColumns } from "./goals-columns"
import { toggleGoalActive, deleteGoal } from "@/app/[locale]/(financial)/goals/actions"
import { toast } from "sonner"
import { useTransition } from "react"
import type { Goal } from "@prisma/client"

interface GoalsTableProps {
    goals: (Goal & {
        driver: { id: string; name: string } | null
        vehicle: { id: string; name: string } | null
    })[]
}

export function GoalsTable({ goals }: GoalsTableProps) {
    const t = useScopedI18n("ui.goals")
    const tCommon = useScopedI18n("common")
    const [isPending, startTransition] = useTransition()

    async function handleToggleActive(id: string) {
        startTransition(async () => {
            try {
                await toggleGoalActive(id)
                toast.success(tCommon("updateSuccess"))
            } catch (error) {
                toast.error(error instanceof Error ? error.message : tCommon("error"))
            }
        })
    }

    async function handleDelete(id: string) {
        if (!confirm(tCommon("confirmDelete"))) return
        startTransition(async () => {
            try {
                await deleteGoal(id)
                toast.success(tCommon("deleteSuccess"))
            } catch (error) {
                toast.error(error instanceof Error ? error.message : tCommon("error"))
            }
        })
    }

    const columns = createGoalsColumns(t, tCommon, handleToggleActive, handleDelete, isPending)

    if (goals.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">{t("noGoals")}</p>
            </div>
        )
    }

    return <DataTable columns={columns} data={goals} emptyMessage={t("noGoals")} />
}
