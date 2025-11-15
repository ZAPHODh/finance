"use client"

import { TrendingDown, TrendingUp, DollarSign, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface SectionCardsProps {
  kpis: {
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    totalKm: number
    totalHours: number
  }
  trends?: {
    revenue: number
    expenses: number
    profit: number
    km: number
    hours: number
  }
}

export function SectionCards({ kpis, trends }: SectionCardsProps) {

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Receita Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(kpis.totalRevenue)}
          </CardTitle>
          {trends && (
            <CardAction>
              <Badge variant="outline">
                {trends.revenue >= 0 ? <TrendingUp /> : <TrendingDown />}
                {trends.revenue >= 0 ? "+" : ""}
                {trends.revenue.toFixed(1)}%
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {trends && trends.revenue >= 0 ? "Crescendo este período" : "Em queda este período"}{" "}
            {trends && trends.revenue >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Total de receitas do período</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Despesas Totais</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(kpis.totalExpenses)}
          </CardTitle>
          {trends && (
            <CardAction>
              <Badge variant="outline">
                {trends.expenses >= 0 ? <TrendingUp /> : <TrendingDown />}
                {trends.expenses >= 0 ? "+" : ""}
                {trends.expenses.toFixed(1)}%
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {trends && trends.expenses >= 0 ? "Aumento nas despesas" : "Redução nas despesas"}{" "}
            {trends && trends.expenses >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Total de despesas do período</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Lucro Líquido</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(kpis.netProfit)}
          </CardTitle>
          {trends && (
            <CardAction>
              <Badge variant="outline">
                {trends.profit >= 0 ? <TrendingUp /> : <TrendingDown />}
                {trends.profit >= 0 ? "+" : ""}
                {trends.profit.toFixed(1)}%
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {trends && trends.profit >= 0 ? "Performance positiva" : "Performance negativa"}{" "}
            {trends && trends.profit >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Receitas menos despesas</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Quilometragem Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(kpis.totalKm, 0)} km
          </CardTitle>
          {trends && (
            <CardAction>
              <Badge variant="outline">
                {trends.km >= 0 ? <TrendingUp /> : <TrendingDown />}
                {trends.km >= 0 ? "+" : ""}
                {trends.km.toFixed(1)}%
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Distância percorrida <MapPin className="size-4" />
          </div>
          <div className="text-muted-foreground">Total de km rodados</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Horas Trabalhadas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(kpis.totalHours, 0)} h
          </CardTitle>
          {trends && (
            <CardAction>
              <Badge variant="outline">
                {trends.hours >= 0 ? <TrendingUp /> : <TrendingDown />}
                {trends.hours >= 0 ? "+" : ""}
                {trends.hours.toFixed(1)}%
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tempo de trabalho <Clock className="size-4" />
          </div>
          <div className="text-muted-foreground">Total de horas no período</div>
        </CardFooter>
      </Card>
    </div>
  )
}
