import {
  KPICardsSkeleton,
  ChartSkeleton,
  DataTableSkeleton,
} from "@/components/skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Filters Skeleton */}
          <div className="flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between lg:px-6">
            <Skeleton className="h-7 w-32" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* KPI Cards Skeleton */}
          <div className="px-4 lg:px-6">
            <KPICardsSkeleton />
          </div>

          {/* Chart Skeleton */}
          <div className="px-4 lg:px-6">
            <ChartSkeleton />
          </div>

          {/* Data Table Skeleton */}
          <div className="px-4 lg:px-6">
            <DataTableSkeleton rows={5} showFilters={false} showHeader={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
