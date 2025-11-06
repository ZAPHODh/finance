import { Skeleton } from "@/components/ui/skeleton"

interface FormSkeletonProps {
  fields?: number
  showTitle?: boolean
}

export function FormSkeleton({
  fields = 5,
  showTitle = true,
}: FormSkeletonProps = {}) {
  return (
    <div className="flex flex-col gap-6">
      {showTitle && <Skeleton className="h-8 w-64" />}

      <div className="space-y-6 rounded-lg border bg-card p-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}
