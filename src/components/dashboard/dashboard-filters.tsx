"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useScopedI18n } from "@/locales/client"
import { Driver, Vehicle, Company } from "@prisma/client"
import { useDashboardFilters } from "@/hooks/use-dashboard-filters"

interface DashboardFiltersProps {
  drivers: Driver[]
  vehicles: Vehicle[]
  companies: Company[]
  onFilterChange?: () => void
}

export function DashboardFilters({
  drivers,
  vehicles,
  companies,
  onFilterChange,
}: DashboardFiltersProps) {
  const t = useScopedI18n("shared.sidebar.dashboard.filters")
  const { filters, setFilter } = useDashboardFilters()

  function handleFilterChange<K extends keyof typeof filters>(
    key: K,
    value: string
  ) {
    setFilter(key, value === "all" ? null : value)
    onFilterChange?.()
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full sm:w-auto sm:min-w-[200px]">
        <Select
          value={filters.period}
          onValueChange={(value) => handleFilterChange("period", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("period")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">{t("today")}</SelectItem>
            <SelectItem value="thisWeek">{t("thisWeek")}</SelectItem>
            <SelectItem value="thisMonth">{t("thisMonth")}</SelectItem>
            <SelectItem value="last30Days">{t("last30Days")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto sm:min-w-[200px]">
        <Select
          value={filters.driverId || "all"}
          onValueChange={(value) => handleFilterChange("driverId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("driver")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allDrivers")}</SelectItem>
            {drivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto sm:min-w-[200px]">
        <Select
          value={filters.vehicleId || "all"}
          onValueChange={(value) => handleFilterChange("vehicleId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("vehicle")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allVehicles")}</SelectItem>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto sm:min-w-[200px]">
        <Select
          value={filters.companyId || "all"}
          onValueChange={(value) => handleFilterChange("companyId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("company")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCompanies")}</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
