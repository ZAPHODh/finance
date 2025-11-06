import {
  KPICardsSkeleton,
  ChartSkeleton,
  DataTableSkeleton,
} from "@/components/skeletons"

export default function Loading() {
  return (
    <div className="@container">
      <div className="flex flex-col gap-6">
        <KPICardsSkeleton />
        <ChartSkeleton />
        <DataTableSkeleton rows={5} showFilters={false} showHeader={false} />
      </div>
    </div>
  )
}
