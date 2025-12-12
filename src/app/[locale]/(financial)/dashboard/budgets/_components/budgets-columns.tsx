"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUpDown, Edit, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
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

export function createBudgetsColumns(
  t: (key: string) => string,
  tCommon: (key: string) => string,
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
        return (
          <div className="font-medium">
            {row.original.name || row.original.expenseType.name}
          </div>
        )
      },
    },
    {
      accessorKey: "expenseType.name",
      header: t("expenseType"),
      cell: ({ row }) => row.original.expenseType.name,
    },
    {
      accessorKey: "period",
      header: t("period"),
      cell: ({ row }) => row.original.period,
    },
    {
      accessorKey: "monthlyLimit",
      header: () => <div className="text-right">{t("monthlyLimit")}</div>,
      cell: ({ row }) => {
        const formatted = formatCurrency(row.original.monthlyLimit)
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
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const { usage } = row.original
        const isWarning = usage.shouldAlert && !usage.exceeded
        const isDanger = usage.exceeded

        return (
          <div className="flex flex-col gap-1">
            <Badge variant={row.original.isActive ? "default" : "secondary"}>
              {row.original.isActive ? t("active") : t("inactive")}
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
        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/budgets/${row.original.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}
