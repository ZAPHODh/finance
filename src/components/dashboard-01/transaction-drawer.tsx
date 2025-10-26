"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { X } from "lucide-react"
import { useScopedI18n } from "@/locales/client"

interface Transaction {
  id: string
  description: string
  category: string
  amount: number
  type: "revenue" | "expense"
  date: Date
  driver?: string
  vehicle?: string
  company?: string
}

interface TransactionDrawerProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDrawer({
  transaction,
  open,
  onOpenChange,
}: TransactionDrawerProps) {
  const t = useScopedI18n("shared.sidebar.dashboard.table")

  if (!transaction) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DrawerTitle>{t("transactionDetails")}</DrawerTitle>
              <DrawerDescription>{formatDate(transaction.date)}</DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">{t("close")}</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="space-y-6 p-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t("type")}
              </span>
              <Badge
                variant={
                  transaction.type === "revenue" ? "default" : "secondary"
                }
                className="font-medium"
              >
                {transaction.type === "revenue" ? t("revenue") : t("expense")}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t("amount")}
              </span>
              <span
                className={`text-2xl font-bold tabular-nums ${
                  transaction.type === "revenue"
                    ? "text-green-600 dark:text-green-500"
                    : "text-red-600 dark:text-red-500"
                }`}
              >
                {formatCurrency(transaction.amount)}
              </span>
            </div>

            {transaction.description && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("description")}
                </span>
                <p className="text-sm">{transaction.description}</p>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t("category")}
              </span>
              <p className="text-sm font-medium">{transaction.category}</p>
            </div>

            {transaction.driver && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("driver")}
                </span>
                <p className="text-sm">{transaction.driver}</p>
              </div>
            )}

            {transaction.vehicle && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("vehicle")}
                </span>
                <p className="text-sm">{transaction.vehicle}</p>
              </div>
            )}

            {transaction.company && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("platform")}
                </span>
                <p className="text-sm">{transaction.company}</p>
              </div>
            )}

            <div className="space-y-2 pt-4 border-t">
              <span className="text-sm font-medium text-muted-foreground">
                ID
              </span>
              <div className="flex items-center gap-2">
                <code className="relative rounded bg-muted px-[0.5rem] py-[0.25rem] font-mono text-xs">
                  {transaction.id}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.id)
                  }}
                >
                  {t("copyId")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-2">
            <Button className="flex-1">{t("edit")}</Button>
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              {t("close")}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
