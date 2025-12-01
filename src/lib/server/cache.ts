import { getCached, setCached, invalidateCacheByTag } from './redis'

/**
 * Cache wrapper with Redis and tag-based revalidation
 * @example
 * const getData = cacheWithTag(
 *   async (userId: string) => { ... },
 *   ['dashboard-data'],
 *   ['dashboard', 'revenues', 'expenses'],
 *   300 // 5 minutes
 * )
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cacheWithTag<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  tags: string[],
  revalidate?: number
): T {
  const ttl = revalidate ?? 60

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const argsKey = JSON.stringify(args)
    const cacheKey = `cache:${keyParts.join(':')}:${tags.join(':')}:${argsKey}`

    try {
      const cached = await getCached<ReturnType<T>>(cacheKey)
      if (cached !== null) {
        return cached
      }
    } catch (error) {
      console.error('Redis cache read error:', error)
    }

    const result = await fn(...args)

    try {
      await setCached(cacheKey, result, ttl)
    } catch (error) {
      console.error('Redis cache write error:', error)
    }

    return result
  }) as T
}

export async function revalidateCacheTag(tag: string): Promise<void> {
  try {
    await invalidateCacheByTag(tag)
  } catch (error) {
    console.error('Redis cache invalidation error:', error)
  }
}

export async function invalidateCache(tag: string): Promise<void> {
  const { revalidateTag } = await import('next/cache')

  revalidateTag(tag)

  await revalidateCacheTag(tag)
}


export const CacheTags = {
  DASHBOARD: 'dashboard',
  EXPENSES: 'expenses',
  REVENUES: 'revenues',
  WORK_LOGS: 'work-logs',
  GOALS: 'goals',
  BUDGETS: 'budgets',
  DRIVERS: 'drivers',
  VEHICLES: 'vehicles',
  PLATFORMS: 'platforms',
  EXPENSE_TYPES: 'expense-types',
  REVENUE_TYPES: 'revenue-types',
  PAYMENT_METHODS: 'payment-methods',
  REPORTS: 'reports',
} as const
