import { useQueryState, parseAsString, throttle } from 'nuqs'
import { useTransition } from 'react'

export interface DashboardFilters {
  period: string
  driverId: string | null
  vehicleId: string | null
  platformId: string | null
}

export function useDashboardQueryFilters() {
  const [isPending, startTransition] = useTransition()

  const queryOptions = {
    shallow: false,
    startTransition,
    limitUrlUpdates: throttle(300),
  }

  const [period, setPeriod] = useQueryState(
    'period',
    parseAsString.withDefault('thisMonth').withOptions(queryOptions)
  )

  const [driverId, setDriverId] = useQueryState('driver', parseAsString.withOptions(queryOptions))
  const [vehicleId, setVehicleId] = useQueryState('vehicle', parseAsString.withOptions(queryOptions))
  const [platformId, setPlatformId] = useQueryState('platform', parseAsString.withOptions(queryOptions))

  const filters: DashboardFilters = {
    period,
    driverId,
    vehicleId,
    platformId,
  }

  function setFilter<K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) {
    if (key === 'period') {
      setPeriod(value as string)
    } else if (key === 'driverId') {
      setDriverId(value)
    } else if (key === 'vehicleId') {
      setVehicleId(value)
    } else if (key === 'platformId') {
      setPlatformId(value)
    }
  }

  function resetFilters() {
    setPeriod('thisMonth')
    setDriverId(null)
    setVehicleId(null)
    setPlatformId(null)
  }

  return {
    filters,
    setFilter,
    resetFilters,
    setPeriod,
    setDriverId,
    setVehicleId,
    setPlatformId,
    isPending,
  }
}
