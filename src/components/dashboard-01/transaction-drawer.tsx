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
import {
  X,
  Calendar,
  DollarSign,
  Tag,
  User,
  Car,
  Building2,
  FileText,
  Copy,
  Check
} from "lucide-react"
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
  mode?: "view" | "edit"
}

export function TransactionDrawer({
  transaction,
  open,
  onOpenChange,
  mode = "view",
}: TransactionDrawerProps) {
  const t = useScopedI18n("dashboard.table")
  const [copied, setCopied] = React.useState(false)

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
    }).format(new Date(date))
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DrawerTitle className="flex items-center gap-2">
                {t("transactionDetails")}
                <Badge
                  variant={transaction.type === "revenue" ? "default" : "secondary"}
                  className="font-medium"
                >
                  {transaction.type === "revenue" ? t("revenue") : t("expense")}
                </Badge>
              </DrawerTitle>
              <DrawerDescription className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                {formatDate(transaction.date)}
                <span className="text-muted-foreground">•</span>
                {formatTime(transaction.date)}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">{t("close")}</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Amount Card */}
            <div className="rounded-lg border bg-muted/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  {t("amount")}
                </div>
                <span
                  className={`text-3xl font-bold tabular-nums ${
                    transaction.type === "revenue"
                      ? "text-green-600 dark:text-green-500"
                      : "text-red-600 dark:text-red-500"
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                {t("category")}
              </div>
              <div className="rounded-lg border bg-card p-4">
                <p className="font-medium">{transaction.category}</p>
              </div>
            </div>

            {/* Description */}
            {transaction.description && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {t("description")}
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-sm">{transaction.description}</p>
                </div>
              </div>
            )}

            {/* Additional Details Grid */}
            {(transaction.driver || transaction.vehicle || transaction.company) && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Detalhes Adicionais
                </div>
                <div className="grid gap-3">
                  {transaction.driver && (
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{t("driver")}</p>
                        <p className="font-medium">{transaction.driver}</p>
                      </div>
                    </div>
                  )}

                  {transaction.vehicle && (
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{t("vehicle")}</p>
                        <p className="font-medium">{transaction.vehicle}</p>
                      </div>
                    </div>
                  )}

                  {transaction.company && (
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{t("platform")}</p>
                        <p className="font-medium">{transaction.company}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transaction ID */}
            <div className="space-y-3 pt-2">
              <div className="text-sm font-medium text-muted-foreground">
                Transaction ID
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <code className="flex-1 font-mono text-xs text-muted-foreground">
                  {transaction.id}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleCopyId}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">{t("copyId")}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-2">
            {mode === "view" && (
              <Button className="flex-1" variant="default">
                {t("edit")}
              </Button>
            )}
            <Button
              variant={mode === "view" ? "outline" : "default"}
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              {t("close")}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
