import { useQueryStates } from 'nuqs'
import { useTransition } from 'react'
import { dashboardSearchParams } from '@/app/[locale]/(financial)/dashboard/searchParams'

export interface DashboardFilters {
  period: string
  driverId: string | null
  vehicleId: string | null
  platformId: string | null
}

export function useDashboardQueryFilters() {
  const [isPending, startTransition] = useTransition()

  const [queryState, setQueryState] = useQueryStates(
    {
      period: dashboardSearchParams.period,
      driver: dashboardSearchParams.driver,
      vehicle: dashboardSearchParams.vehicle,
      platform: dashboardSearchParams.platform,
    },
    {
      shallow: false,
      startTransition,
      throttleMs: 300,
    }
  )

  const filters: DashboardFilters = {
    period: queryState.period,
    driverId: queryState.driver,
    vehicleId: queryState.vehicle,
    platformId: queryState.platform,
  }

  function setFilter<K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) {
    if (key === 'period') {
      setQueryState({ period: value as string })
    } else if (key === 'driverId') {
      setQueryState({ driver: value })
    } else if (key === 'vehicleId') {
      setQueryState({ vehicle: value })
    } else if (key === 'platformId') {
      setQueryState({ platform: value })
    }
  }

  function resetFilters() {
    setQueryState({
      period: 'thisMonth',
      driver: null,
      vehicle: null,
      platform: null,
    })
  }

  return {
    filters,
    setFilter,
    resetFilters,
    setPeriod: (value: string) => setQueryState({ period: value }),
    setDriverId: (value: string | null) => setQueryState({ driver: value }),
    setVehicleId: (value: string | null) => setQueryState({ vehicle: value }),
    setPlatformId: (value: string | null) => setQueryState({ platform: value }),
    isPending,
  }
}
