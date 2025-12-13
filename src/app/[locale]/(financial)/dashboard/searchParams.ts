import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const dashboardSearchParams = {
  period: parseAsString.withDefault('thisMonth'),
  driver: parseAsString,
  vehicle: parseAsString,
  platform: parseAsString,
}

export const dashboardSearchParamsCache = createSearchParamsCache(dashboardSearchParams)
