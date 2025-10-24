import { unstable_cache } from 'next/cache'

/**
 * Cache wrapper with tag-based revalidation
 * @example
 * const getData = cacheWithTag(
 *   async (userId: string) => { ... },
 *   ['dashboard-data'],
 *   ['dashboard', 'revenues', 'expenses'],
 *   300 // 5 minutes
 * )
 */
export function cacheWithTag<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  tags: string[],
  revalidate?: number
): T {
  return unstable_cache(fn, keyParts, {
    tags,
    revalidate: revalidate ?? 60 // 1 minute default
  }) as T
}

/**
 * Cache tags for different data types
 */
export const CacheTags = {
  DASHBOARD: 'dashboard',
  EXPENSES: 'expenses',
  REVENUES: 'revenues',
  WORK_LOGS: 'work-logs',
  GOALS: 'goals',
  BUDGETS: 'budgets',
  DRIVERS: 'drivers',
  VEHICLES: 'vehicles',
  COMPANIES: 'companies',
  EXPENSE_TYPES: 'expense-types',
  REVENUE_TYPES: 'revenue-types',
  PAYMENT_METHODS: 'payment-methods',
} as const
