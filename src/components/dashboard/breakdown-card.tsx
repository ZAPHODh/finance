import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface BreakdownItem {
  name: string
  value: number
  percentage?: number
  icon?: LucideIcon
}

interface BreakdownCardProps {
  title: string
  items: BreakdownItem[]
  icon: LucideIcon
  emptyMessage: string
  formatValue?: (value: number) => string
}

export function BreakdownCard({
  title,
  items,
  icon: Icon,
  emptyMessage,
  formatValue = (value) => value.toLocaleString(),
}: BreakdownCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const ItemIcon = item.icon
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {ItemIcon && <ItemIcon className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      {formatValue(item.value)}
                    </span>
                    {item.percentage !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        ({item.percentage.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
