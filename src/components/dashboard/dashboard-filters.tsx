"use client"

import { useDashboardQueryFilters } from "@/hooks/use-dashboard-query-filters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useScopedI18n } from "@/locales/client"
import { useRouter } from "next/navigation"
import { useEffect, useTransition } from "react"

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
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    filters,
    setPeriod,
    setDriverId,
    setVehicleId,
    setPlatformId,
    resetFilters,
  } = useDashboardQueryFilters()

  useEffect(() => {
    startTransition(() => {
      router.refresh()
    })
  }, [filters.period, filters.driverId, filters.vehicleId, filters.platformId, router])

  const hasActiveFilters =
    filters.period !== "thisMonth" ||
    filters.driverId !== null ||
    filters.vehicleId !== null ||
    filters.platformId !== null

  return (
    <div className="flex flex-col gap-4 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Filters</h2>
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
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Select value={filters.period} onValueChange={setPeriod}>
            <SelectTrigger id="period">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="last30Days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver">Driver</Label>
          <Select
            value={filters.driverId || "all"}
            onValueChange={(value) => setDriverId(value === "all" ? null : value)}
          >
            <SelectTrigger id="driver">
              <SelectValue placeholder="All drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicle">Vehicle</Label>
          <Select
            value={filters.vehicleId || "all"}
            onValueChange={(value) =>
              setVehicleId(value === "all" ? null : value)
            }
          >
            <SelectTrigger id="vehicle">
              <SelectValue placeholder="All vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select
            value={filters.platformId || "all"}
            onValueChange={(value) =>
              setPlatformId(value === "all" ? null : value)
            }
          >
            <SelectTrigger id="platform">
              <SelectValue placeholder="All platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map((platform) => (
                <SelectItem key={platform.id} value={platform.id}>
                  {platform.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
