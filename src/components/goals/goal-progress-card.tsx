"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, CheckCircle2 } from "lucide-react"
import { useScopedI18n } from "@/locales/client"
import { GoalType } from "@prisma/client"

interface GoalProgressCardProps {
    goal: {
        id: string
        name: string | null
        type: GoalType
        targetValue: number
    }
    progress: {
        currentValue: number
        percentage: number
        achieved: boolean
    }
}

export function GoalProgressCard({ goal, progress }: GoalProgressCardProps) {
    const t = useScopedI18n("shared.goals")

    const formatValue = (value: number) => {
        if (goal.type.includes("REVENUE") || goal.type.includes("PROFIT")) {
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(value)
        }
        if (goal.type.includes("KM")) {
            return `${value.toFixed(0)} km`
        }
        if (goal.type.includes("HOURS")) {
            return `${value.toFixed(1)}h`
        }
        return value.toFixed(2)
    }

    const getGoalTypeText = (type: GoalType) => {
        switch (type) {
            case "DAILY_REVENUE": return t("types.DAILY_REVENUE")
            case "WEEKLY_REVENUE": return t("types.WEEKLY_REVENUE")
            case "MONTHLY_REVENUE": return t("types.MONTHLY_REVENUE")
            case "MONTHLY_PROFIT": return t("types.MONTHLY_PROFIT")
            case "MONTHLY_KM": return t("types.MONTHLY_KM")
            case "MONTHLY_HOURS": return t("types.MONTHLY_HOURS")
            case "CUSTOM": return t("types.CUSTOM")
            default: return type
        }
    }

    return (
        <Card className={progress.achieved ? "border-green-500" : ""}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            {goal.name || getGoalTypeText(goal.type)}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {getGoalTypeText(goal.type)}
                        </p>
                    </div>
                    {progress.achieved && (
                        <Badge variant="default" className="bg-green-500">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t("achieved")}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            {t("progress")}
                        </span>
                        <span className="font-medium">
                            {formatValue(progress.currentValue)} de {formatValue(goal.targetValue)}
                        </span>
                    </div>
                    <Progress
                        value={progress.percentage}
                        className={progress.achieved ? "[&>div]:bg-green-500" : ""}
                    />
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">
                            {progress.percentage.toFixed(1)}%
                        </span>
                        {!progress.achieved && (
                            <span className="text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Faltam {formatValue(goal.targetValue - progress.currentValue)}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
