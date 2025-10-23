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
              <DrawerTitle>Detalhes da Transação</DrawerTitle>
              <DrawerDescription>{formatDate(transaction.date)}</DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="space-y-6 p-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Tipo
              </span>
              <Badge
                variant={
                  transaction.type === "revenue" ? "default" : "secondary"
                }
              >
                {transaction.type === "revenue" ? "Receita" : "Despesa"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Valor
              </span>
              <span
                className={`text-2xl font-bold ${
                  transaction.type === "revenue"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(transaction.amount)}
              </span>
            </div>

            {transaction.description && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Descrição
                </span>
                <p className="text-sm">{transaction.description}</p>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Categoria
              </span>
              <p className="text-sm">{transaction.category}</p>
            </div>

            {transaction.driver && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Motorista
                </span>
                <p className="text-sm">{transaction.driver}</p>
              </div>
            )}

            {transaction.vehicle && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Veículo
                </span>
                <p className="text-sm">{transaction.vehicle}</p>
              </div>
            )}

            {transaction.company && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Empresa
                </span>
                <p className="text-sm">{transaction.company}</p>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                ID da Transação
              </span>
              <div className="flex items-center gap-2">
                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {transaction.id}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.id)
                  }}
                >
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-2">
            <Button className="flex-1">Editar</Button>
            <Button variant="outline" className="flex-1">
              Excluir
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
