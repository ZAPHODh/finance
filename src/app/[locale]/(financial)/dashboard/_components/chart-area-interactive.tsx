"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { formatCurrency } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

interface ChartData {
  date: string
  revenue: number
  expenses: number
}

interface ChartAreaInteractiveProps {
  data: ChartData[]
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const t = useScopedI18n('shared.dashboard.chart')
  const [timeRange, setTimeRange] = React.useState("30d")

  const chartConfig = {
    visitors: {
      label: t('values'),
    },
    revenue: {
      label: t('revenue'),
      color: "var(--chart-1)",
    },
    expenses: {
      label: t('expenses'),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "90d":
        return t('threeMonths')
      case "30d":
        return t('thirtyDays')
      case "7d":
        return t('sevenDays')
      default:
        return t('thirtyDays')
    }
  }

  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    const now = new Date()
    let daysToSubtract = 30

    if (timeRange === "90d") {
      daysToSubtract = 90
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }

    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return data.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate
    })
  }, [data, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {t('descriptionLong')} {getTimeRangeLabel(timeRange)}
          </span>
          <span className="@[540px]/card:hidden">
            {t('descriptionShort')} {getTimeRangeLabel(timeRange)}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">{t('lastThreeMonths')}</ToggleGroupItem>
            <ToggleGroupItem value="30d">{t('lastThirtyDays')}</ToggleGroupItem>
            <ToggleGroupItem value="7d">{t('lastSevenDays')}</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label={t('selectPeriod')}
            >
              <SelectValue placeholder={t('lastThirtyDays')} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {t('lastThreeMonths')}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t('lastThirtyDays')}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {t('lastSevenDays')}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="expenses"
              type="natural"
              fill="url(#fillExpenses)"
              stroke="var(--color-expenses)"
              stackId="a"
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
