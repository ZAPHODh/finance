"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

interface ExpenseBreakdownProps {
  expensesByType: Array<{ name: string; value: number; percentage: number }>
  totalExpenses: number
  budgetTotal?: number
  profitGoal?: number
}

export function ChartExpenseRadial({
  expensesByType,
  totalExpenses,
  budgetTotal,
  profitGoal
}: ExpenseBreakdownProps) {
  const t = useScopedI18n("dashboard.expenseBreakdown")

  const topExpenses = expensesByType.slice(0, 5)

  const chartData = [{
    period: "current",
    ...topExpenses.reduce((acc, item, index) => {
      acc[`expense${index}`] = item.value
      return acc
    }, {} as Record<string, number>)
  }]

  const chartConfig = topExpenses.reduce((acc, item, index) => {
    acc[`expense${index}`] = {
      label: item.name,
      color: `var(--chart-${index + 1})`,
    }
    return acc
  }, {} as ChartConfig)

  const hasGoals = budgetTotal !== undefined || profitGoal !== undefined

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="h-32">
          <ChartContainer config={chartConfig}>
            <RadialBarChart
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              data={chartData}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) - 16}
                            className="fill-foreground font-bold text-2xl tabular-nums"
                          >
                            {formatCurrency(totalExpenses)}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 4} className="fill-muted-foreground">
                            {t("total")}
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              {topExpenses.map((_, index) => (
                <RadialBar
                  key={index}
                  dataKey={`expense${index}`}
                  stackId="a"
                  cornerRadius={4}
                  fill={`var(--color-expense${index})`}
                  className="stroke-4 stroke-card"
                />
              )).reverse()}
            </RadialBarChart>
          </ChartContainer>
        </div>
        <Separator />
        <div className="space-y-2">
          {topExpenses.map((expense, index) => (
            <div key={expense.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: `var(--chart-${index + 1})` }}
                />
                <span className="text-sm">{expense.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium tabular-nums">
                  {formatCurrency(expense.value)}
                </span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  ({expense.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
        {hasGoals && (
          <>
            <Separator />
            <div className="space-y-1 text-xs">
              {budgetTotal !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("budgetLimit")}</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(budgetTotal)}
                  </span>
                </div>
              )}
              {profitGoal !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("profitGoal")}</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(profitGoal)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
