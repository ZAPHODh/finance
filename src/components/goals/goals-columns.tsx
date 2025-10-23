"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import Link from "next/link"
import type { Goal } from "@prisma/client"

type GoalWithRelations = Goal & {
  driver: { id: string; name: string } | null
  vehicle: { id: string; name: string } | null
}

export function createGoalsColumns(
  t: any,
  tCommon: any,
  onToggleActive: (id: string) => void,
  onDelete: (id: string) => void,
  isPending: boolean
): ColumnDef<GoalWithRelations>[] {
  return [
    {
      accessorKey: "name",
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
        const goal = row.original
        return (
          <div className="font-medium">
            {goal.name || t(`types.${goal.type}`)}
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: t("type"),
      cell: ({ row }) => t(`types.${row.original.type}`),
    },
    {
      accessorKey: "targetValue",
      header: () => <div className="text-right">{t("targetValue")}</div>,
      cell: ({ row }) => {
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(row.original.targetValue)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "period",
      header: t("period"),
    },
    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ row }) => row.original.driver?.name || "-",
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => row.original.vehicle?.name || "-",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? t("active") : t("inactive")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">{tCommon("actions")}</div>,
      cell: ({ row }) => {
        const goal = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleActive(goal.id)}
              disabled={isPending}
            >
              {goal.isActive ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/goals/${goal.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(goal.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}
