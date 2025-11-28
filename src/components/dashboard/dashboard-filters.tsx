"use client"

import { useDashboardQueryFilters } from "@/hooks/use-dashboard-query-filters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useScopedI18n } from "@/locales/client"
import { useTransition } from "react"

interface DashboardFiltersProps {
  drivers: Array<{ id: string; name: string }>
  vehicles: Array<{ id: string; name: string }>
  platforms: Array<{ id: string; name: string }>
}

export function DashboardFilters({
  drivers,
  vehicles,
  platforms,
}: DashboardFiltersProps) {
  const t = useScopedI18n("dashboard.filters")
  const [isPending, startTransition] = useTransition()

  const {
    filters,
    setPeriod,
    setDriverId,
    setVehicleId,
    setPlatformId,
    resetFilters,
  } = useDashboardQueryFilters()

  const hasActiveFilters =
    filters.period !== "thisMonth" ||
    filters.driverId !== null ||
    filters.vehicleId !== null ||
    filters.platformId !== null

  const FilterGrid = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="period">{t("period")}</Label>
        <Select value={filters.period} onValueChange={setPeriod}>
          <SelectTrigger id="period">
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

      <div className="space-y-2">
        <Label htmlFor="driver">{t("driver")}</Label>
        <Select
          value={filters.driverId || "all"}
          onValueChange={(value) => setDriverId(value === "all" ? null : value)}
        >
          <SelectTrigger id="driver">
            <SelectValue placeholder={t("allDrivers")} />
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

      <div className="space-y-2">
        <Label htmlFor="vehicle">{t("vehicle")}</Label>
        <Select
          value={filters.vehicleId || "all"}
          onValueChange={(value) =>
            setVehicleId(value === "all" ? null : value)
          }
        >
          <SelectTrigger id="vehicle">
            <SelectValue placeholder={t("allVehicles")} />
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

      <div className="space-y-2">
        <Label htmlFor="platform">{t("platform")}</Label>
        <Select
          value={filters.platformId || "all"}
          onValueChange={(value) =>
            setPlatformId(value === "all" ? null : value)
          }
        >
          <SelectTrigger id="platform">
            <SelectValue placeholder={t("allPlatforms")} />
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

  return (
    <>
      {/* Mobile Accordion - visible only on small screens */}
      <div className="px-4 md:hidden lg:px-6">
        <Accordion type="single" collapsible defaultValue="filters">
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{t("filters")}</h2>
                {isPending && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <FilterGrid />
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="w-full"
                  >
                    {t("reset")}
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop Layout - visible only on md and larger screens */}
      <div className="hidden flex-col gap-4 px-4 md:flex lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{t("filters")}</h2>
            {isPending && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2 lg:px-3"
            >
              {t("reset")}
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <FilterGrid />
      </div>
    </>
  )
}
