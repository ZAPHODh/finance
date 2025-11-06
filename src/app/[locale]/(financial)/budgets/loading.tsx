import { DataTableSkeleton } from "@/components/skeletons"

export default function BudgetsLoading() {
  return <DataTableSkeleton rows={10} columns={5} />
}
