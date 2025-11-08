import { DataTableSkeleton } from "@/components/skeletons"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 md:px-0 py-6">
      <DataTableSkeleton rows={10} columns={6} />
    </div>
  )
}
