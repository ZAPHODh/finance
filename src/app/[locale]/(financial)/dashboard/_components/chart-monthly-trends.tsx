"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"
import { format } from "date-fns"
import { pt, enUS } from "date-fns/locale"
import { useCurrentLocale } from "@/locales/client"

interface MonthlyTrendsProps {
  monthlyData: Array<{ month: string; revenue: number; expenses: number }>
  revenueGoal?: number
  profitGoal?: number
}

export function ChartMonthlyTrends({
  monthlyData,
  revenueGoal,
  profitGoal
}: MonthlyTrendsProps) {
  const t = useScopedI18n("dashboard.monthlyTrends")
  const locale = useCurrentLocale()
  const dateLocale = locale === "pt" ? pt : enUS

  const chartData = monthlyData.map(item => ({
    month: format(new Date(item.month + "-01"), "MMM", { locale: dateLocale }),
    revenue: item.revenue,
    expenses: item.expenses,
  }))

  const chartConfig = {
    revenue: {
      label: t("revenue"),
      color: "var(--chart-1)",
    },
    expenses: {
      label: t("expenses"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.expenses)))
  const yAxisMax = Math.ceil(maxValue * 1.2)

  const hasGoals = revenueGoal !== undefined || profitGoal !== undefined

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-72 w-full" config={chartConfig}>
          <BarChart margin={{ left: -25, right: 0, top: 25, bottom: 0 }} accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value >= 1000 ? `${value / 1000}k` : value}`}
              domain={[0, yAxisMax]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            {revenueGoal !== undefined && (
              <ReferenceLine
                y={revenueGoal}
                stroke="var(--chart-1)"
                strokeDasharray="3 3"
                label={{ value: t("goal"), position: "insideTopRight", fill: "var(--chart-1)" }}
              />
            )}
            {profitGoal !== undefined && (
              <ReferenceLine
                y={profitGoal}
                stroke="var(--chart-3)"
                strokeDasharray="3 3"
                label={{ value: t("goal"), position: "insideBottomRight", fill: "var(--chart-3)" }}
              />
            )}
            <Bar dataKey="revenue" fill={chartConfig.revenue.color} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill={chartConfig.expenses.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
        {hasGoals && (
          <>
            <Separator className="mt-4" />
            <div className="space-y-1 pt-4 text-xs">
              {revenueGoal !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("revenueGoal")}</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(revenueGoal)}
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
