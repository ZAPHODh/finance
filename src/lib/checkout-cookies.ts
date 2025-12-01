interface CheckoutCookies {
  plan?: string
  interval?: string
}

interface CookieStore {
  get(name: string): { value?: string } | undefined
  set(name: string, value: string, options?: {
    path?: string
    httpOnly?: boolean
    secure?: boolean
    maxAge?: number
    sameSite?: 'lax' | 'strict' | 'none'
  }): void
  delete(name: string): void
}

const COOKIE_MAX_AGE = 600
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: COOKIE_MAX_AGE,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}

export function setCheckoutCookies(plan: string, interval: string) {
  if (typeof document === 'undefined') return

  const secure = COOKIE_OPTIONS.secure ? '; Secure' : ''
  const sameSite = `; SameSite=${COOKIE_OPTIONS.sameSite}`

  document.cookie = `checkout_plan=${plan}; Path=${COOKIE_OPTIONS.path}; Max-Age=${COOKIE_OPTIONS.maxAge}${sameSite}${secure}`
  document.cookie = `checkout_interval=${interval}; Path=${COOKIE_OPTIONS.path}; Max-Age=${COOKIE_OPTIONS.maxAge}${sameSite}${secure}`
}

export function getCheckoutCookies(): CheckoutCookies {
  if (typeof document === 'undefined') return {}

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return {
    plan: cookies['checkout_plan'],
    interval: cookies['checkout_interval'],
  }
}

export function clearCheckoutCookies() {
  if (typeof document === 'undefined') return

  document.cookie = 'checkout_plan=; Path=/; Max-Age=0'
  document.cookie = 'checkout_interval=; Path=/; Max-Age=0'
}

export async function getCheckoutCookiesServer(cookieStore: CookieStore): Promise<CheckoutCookies> {
  const plan = cookieStore.get('checkout_plan')?.value
  const interval = cookieStore.get('checkout_interval')?.value

  const validPlans = ['simple', 'pro']
  const validIntervals = ['monthly', 'yearly']

  const sanitizedPlan = plan && validPlans.includes(plan) ? plan : undefined
  const sanitizedInterval = interval && validIntervals.includes(interval) ? interval : undefined

  if (plan && !sanitizedPlan) {
    console.warn(`Invalid plan in cookie: ${plan}`)
  }

  if (interval && !sanitizedInterval) {
    console.warn(`Invalid interval in cookie: ${interval}`)
  }

  return { plan: sanitizedPlan, interval: sanitizedInterval }
}

export async function setPostOnboardingCookies(cookieStore: CookieStore, plan: string, interval: string) {
  const validPlans = ['simple', 'pro']
  const validIntervals = ['monthly', 'yearly']

  if (!validPlans.includes(plan)) {
    console.error(`Attempt to set invalid post-onboarding plan: ${plan}`)
    return
  }

  if (!validIntervals.includes(interval)) {
    console.error(`Attempt to set invalid post-onboarding interval: ${interval}`)
    return
  }

  cookieStore.set('post_onboarding_plan', plan, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 30,
    sameSite: 'lax',
  })

  cookieStore.set('post_onboarding_interval', interval, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 30,
    sameSite: 'lax',
  })
}

export async function getPostOnboardingCookies(cookieStore: CookieStore): Promise<CheckoutCookies> {
  const plan = cookieStore.get('post_onboarding_plan')?.value
  const interval = cookieStore.get('post_onboarding_interval')?.value

  const validPlans = ['simple', 'pro']
  const validIntervals = ['monthly', 'yearly']

  const sanitizedPlan = plan && validPlans.includes(plan) ? plan : undefined
  const sanitizedInterval = interval && validIntervals.includes(interval) ? interval : undefined

  if (plan && !sanitizedPlan) {
    console.warn(`Invalid post-onboarding plan in cookie: ${plan}`)
  }

  if (interval && !sanitizedInterval) {
    console.warn(`Invalid post-onboarding interval in cookie: ${interval}`)
  }

  return { plan: sanitizedPlan, interval: sanitizedInterval }
}

export async function clearCheckoutCookiesServer(cookieStore: CookieStore) {
  cookieStore.delete('checkout_plan')
  cookieStore.delete('checkout_interval')
}

export async function clearPostOnboardingCookies(cookieStore: CookieStore) {
  cookieStore.delete('post_onboarding_plan')
  cookieStore.delete('post_onboarding_interval')
}
