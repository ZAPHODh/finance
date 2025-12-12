"use client"

import { Gauge, TrendingUp, DollarSign, Activity } from "lucide-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useScopedI18n } from "@/locales/client"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface EfficiencyCardsProps {
  metrics: {
    revenuePerKm: number
    revenuePerHour: number
    costPerKm: number
    netProfitPerTrip: number
    profitMargin: number
  }
  paymentFees?: {
    grossRevenue: number
    totalFees: number
    netRevenue: number
    feePercentage: number
  }
}

export function EfficiencyCards({ metrics, paymentFees }: EfficiencyCardsProps) {
  const t = useScopedI18n("dashboard.efficiency")

  return (
    <div className="*:data-[slot=card]:from-muted/30 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("revenuePerKm")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(metrics.revenuePerKm)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t("revenuePerKmFooter")} <Gauge className="size-4" />
          </div>
          <div className="text-muted-foreground">{t("revenuePerKmDescription")}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("revenuePerHour")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(metrics.revenuePerHour)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t("revenuePerHourFooter")} <Activity className="size-4" />
          </div>
          <div className="text-muted-foreground">{t("revenuePerHourDescription")}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("costPerKm")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(metrics.costPerKm)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t("costPerKmFooter")} <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">{t("costPerKmDescription")}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("profitMargin")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(metrics.profitMargin, 1)}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t("profitMarginFooter")} <DollarSign className="size-4" />
          </div>
          <div className="text-muted-foreground">{t("profitMarginDescription")}</div>
        </CardFooter>
      </Card>

      {paymentFees && paymentFees.totalFees > 0 && (
        <Card className="@container/card @3xl/main:col-span-2">
          <CardHeader>
            <CardDescription>{t("netRevenue")}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {formatCurrency(paymentFees.netRevenue)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t("netRevenueFooter", {
                fees: formatCurrency(paymentFees.totalFees),
                percentage: formatNumber(paymentFees.feePercentage, 1),
              })}
            </div>
            <div className="text-muted-foreground">
              {t("netRevenueDescription", {
                grossRevenue: formatCurrency(paymentFees.grossRevenue),
              })}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
