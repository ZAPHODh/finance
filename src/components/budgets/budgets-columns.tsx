"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUpDown, Edit, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { Budget, ExpenseType } from "@prisma/client"

type BudgetWithUsage = {
  budget: Budget & {
    expenseType: ExpenseType
  }
  usage: {
    spent: number
    remaining: number
    percentage: number
    exceeded: boolean
    shouldAlert: boolean
  }
}

export function createBudgetsColumns(
  t: any,
  tCommon: any,
  onDelete: (id: string) => void,
  formatCurrency: (value: number) => string
): ColumnDef<BudgetWithUsage>[] {
  return [
    {
      accessorKey: "budget.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const { budget } = row.original
        return (
          <div className="font-medium">
            {budget.name || budget.expenseType.name}
          </div>
        )
      },
    },
    {
      accessorKey: "budget.expenseType.name",
      header: t("expenseType"),
      cell: ({ row }) => row.original.budget.expenseType.name,
    },
    {
      accessorKey: "budget.period",
      header: t("period"),
      cell: ({ row }) => row.original.budget.period,
    },
    {
      accessorKey: "budget.monthlyLimit",
      header: () => <div className="text-right">{t("monthlyLimit")}</div>,
      cell: ({ row }) => {
        const formatted = formatCurrency(row.original.budget.monthlyLimit)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "usage.spent",
      header: () => <div className="text-right">{t("spent")}</div>,
      cell: ({ row }) => {
        const { usage } = row.original
        const formatted = formatCurrency(usage.spent)
        return (
          <div className="text-right">
            <div className="font-medium">{formatted}</div>
            <div className="text-xs text-muted-foreground">
              {usage.percentage.toFixed(1)}%
            </div>
          </div>
        )
      },
    },
    {
      id: "progress",
      header: t("progress"),
      cell: ({ row }) => {
        const { usage } = row.original
        const isWarning = usage.shouldAlert && !usage.exceeded
        const isDanger = usage.exceeded

        return (
          <div className="w-32">
            <Progress
              value={Math.min(usage.percentage, 100)}
              className={isDanger ? "[&>div]:bg-red-500" : isWarning ? "[&>div]:bg-yellow-500" : ""}
            />
          </div>
        )
      },
    },
    {
      accessorKey: "usage.remaining",
      header: () => <div className="text-right">{t("remaining")}</div>,
      cell: ({ row }) => {
        const { usage } = row.original
        const formatted = formatCurrency(Math.abs(usage.remaining))
        return (
          <div className={`text-right font-medium ${usage.remaining < 0 ? "text-red-500" : ""}`}>
            {usage.remaining >= 0 ? formatted : `-${formatted}`}
          </div>
        )
      },
    },
    {
      accessorKey: "budget.isActive",
      header: "Status",
      cell: ({ row }) => {
        const { budget, usage } = row.original
        const isWarning = usage.shouldAlert && !usage.exceeded
        const isDanger = usage.exceeded

        return (
          <div className="flex flex-col gap-1">
            <Badge variant={budget.isActive ? "default" : "secondary"}>
              {budget.isActive ? t("active") : t("inactive")}
            </Badge>
            {isDanger && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {t("exceeded")}
              </Badge>
            )}
            {isWarning && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Alerta
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{tCommon("actions")}</div>,
      cell: ({ row }) => {
        const { budget } = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/budgets/${budget.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(budget.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}
