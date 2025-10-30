"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useScopedI18n } from "@/locales/client"
import { Driver, Vehicle, Platform } from "@prisma/client"
import { useDashboardQueryFilters } from "@/hooks/use-dashboard-query-filters"

interface DashboardFiltersProps {
  drivers: Driver[]
  vehicles: Vehicle[]
  platforms: Platform[]
  onFilterChange?: () => void
}

export function DashboardFilters({
  drivers,
  vehicles,
  platforms,
  onFilterChange,
}: DashboardFiltersProps) {
  const t = useScopedI18n("shared.sidebar.dashboard.filters")
  const { filters, setFilter } = useDashboardQueryFilters()

  function handleFilterChange(
    key: keyof typeof filters,
    value: string
  ) {
    if (key === "period") {
      setFilter("period", value)
    } else if (key === "driverId") {
      setFilter("driverId", value === "all" ? null : value)
    } else if (key === "vehicleId") {
      setFilter("vehicleId", value === "all" ? null : value)
    } else if (key === "platformId") {
      setFilter("platformId", value === "all" ? null : value)
    }
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
          value={filters.platformId || "all"}
          onValueChange={(value) => handleFilterChange("platformId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("platform")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allPlatforms")}</SelectItem>
            {platforms.map((platform) => (
              <SelectItem key={platform.id} value={platform.id}>
                {platform.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
