import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getScopedI18n } from "@/locales/server"
import { getDashboardFilterOptions } from "./actions"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  const tDashboard = await getScopedI18n("shared.sidebar.dashboard")
  const tFinancial = await getScopedI18n("shared.financial")
  const filterOptions = await getDashboardFilterOptions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tDashboard("title")}
          </h1>
          <p className="text-muted-foreground">{tDashboard("overview")}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/expenses/new">
              <Plus className="mr-2 h-4 w-4" />
              {tFinancial("expenses.new")}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/revenues/new">
              <Plus className="mr-2 h-4 w-4" />
              {tFinancial("revenues.new")}
            </Link>
          </Button>
        </div>
      </div>

      <DashboardFilters
        drivers={filterOptions.drivers}
        vehicles={filterOptions.vehicles}
        companies={filterOptions.companies}
      />

      <DashboardContent />
    </div>
  )
}
