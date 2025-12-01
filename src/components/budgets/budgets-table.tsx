"use client"

import { useScopedI18n } from "@/locales/client"
import { DataTable } from "@/components/ui/data-table/data-table"
import { createBudgetsColumns } from "./budgets-columns"
import { deleteBudget } from "@/app/[locale]/(financial)/budgets/actions"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import type { Budget } from "@prisma/client"

type BudgetWithUsage = (Budget & {
    expenseType: {
        id: string
        name: string
    }
}) & {
    usage: {
        spent: number
        remaining: number
        percentage: number
        exceeded: boolean
        shouldAlert: boolean
    }
}

interface BudgetsTableProps {
    budgets: BudgetWithUsage[]
}

export function BudgetsTable({ budgets }: BudgetsTableProps) {
    const t = useScopedI18n("ui.budgets")
    const tCommon = useScopedI18n("common")

    async function handleDelete(id: string) {
        if (!confirm(tCommon("confirmDelete"))) return
        try {
            await deleteBudget(id)
            toast.success(tCommon("deleteSuccess"))
        } catch (error) {
            toast.error(error instanceof Error ? error.message : tCommon("error"))
        }

    }

    const columns = createBudgetsColumns(t as (key: string) => string, tCommon as (key: string) => string, handleDelete, formatCurrency)

    if (budgets.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">{t("noBudgets")}</p>
            </div>
        )
    }

    return <DataTable columns={columns} data={budgets} emptyMessage={t("noBudgets")} />
}
