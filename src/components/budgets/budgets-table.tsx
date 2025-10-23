"use client"

import { useScopedI18n } from "@/locales/client"
import { DataTable } from "@/components/ui/data-table/data-table"
import { createBudgetsColumns } from "./budgets-columns"
import { deleteBudget } from "@/app/[locale]/(financial)/budgets/actions"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"

interface BudgetsTableProps {
    budgets: any[]
}

export function BudgetsTable({ budgets }: BudgetsTableProps) {
    const t = useScopedI18n("shared.budgets")
    const tCommon = useScopedI18n("shared.common")

    const { execute: executeDelete } = useAction(deleteBudget, {
        onSuccess: () => {
            toast.success(tCommon("deleteSuccess"))
        },
        onError: (error) => {
            toast.error(error.error.serverError?.message || tCommon("error"))
        },
    })

    async function handleDelete(id: string) {
        if (!confirm(tCommon("confirmDelete"))) return
        executeDelete({ id })
    }

    function formatCurrency(value: number) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const columns = createBudgetsColumns(t, tCommon, handleDelete, formatCurrency)

    if (budgets.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">{t("noBudgets")}</p>
            </div>
        )
    }

    return <DataTable columns={columns} data={budgets} emptyMessage={t("noBudgets")} />
}
