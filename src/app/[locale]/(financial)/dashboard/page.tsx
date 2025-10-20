import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getScopedI18n } from "@/locales/server"
import { getDashboardFilterOptions } from "./actions"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  const tDashboard = await getScopedI18n("shared.sidebar.dashboard")
  const filterOptions = await getDashboardFilterOptions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {tDashboard("title")}
        </h1>
        <p className="text-muted-foreground">{tDashboard("overview")}</p>
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
