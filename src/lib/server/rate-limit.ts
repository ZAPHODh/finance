import { Ratelimit, type Duration } from "@upstash/ratelimit"
import { redis, isRedisEnabled } from "./redis"

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

interface RateLimitConfig {
  requests: number
  window: Duration
}

function createRateLimiter(config: RateLimitConfig) {
  if (!isRedisEnabled || !redis) {
    console.warn("Redis not enabled, rate limiting disabled")
    return null
  }

  return new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: "@upstash/ratelimit",
  })
}

export async function rateLimitByIP(
  identifier: string,
  requests: number = 10,
  window: Duration = "1 m"
): Promise<RateLimitResult> {
  const limiter = createRateLimiter({ requests, window })

  if (!limiter) {
    return {
      success: true,
      limit: requests,
      remaining: requests,
      reset: Date.now() + 60000,
    }
  }

  try {
    const result = await limiter.limit(`ip:${identifier}`)

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
    }
  } catch (error) {
    console.error("Rate limit error (IP):", error)
    return {
      success: true,
      limit: requests,
      remaining: requests,
      reset: Date.now() + 60000,
    }
  }
}

export async function rateLimitByUser(
  userId: string,
  requests: number = 10,
  window: Duration = "1 m"
): Promise<RateLimitResult> {
  const limiter = createRateLimiter({ requests, window })

  if (!limiter) {
    return {
      success: true,
      limit: requests,
      remaining: requests,
      reset: Date.now() + 60000,
    }
  }

  try {
    const result = await limiter.limit(`user:${userId}`)

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
    }
  } catch (error) {
    console.error("Rate limit error (User):", error)
    return {
      success: true,
      limit: requests,
      remaining: requests,
      reset: Date.now() + 60000,
    }
  }
}

export async function rateLimitByEmail(
  email: string,
  requests: number = 5,
  window: Duration = "15 m"
): Promise<RateLimitResult> {
  const limiter = createRateLimiter({ requests, window })

  if (!limiter) {
    return {
      success: true,
      limit: requests,
      remaining: requests,
      reset: Date.now() + 900000,
    }
  }

  try {
    const result = await limiter.limit(`email:${email}`)

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
    }
  } catch (error) {
    console.error("Rate limit error (Email):", error)
    return {
      success: true,
      limit: requests,
      remaining: requests,
      reset: Date.now() + 900000,
    }
  }
}

export async function checkMultipleRateLimits(
  checks: Array<() => Promise<RateLimitResult>>
): Promise<RateLimitResult> {
  const results = await Promise.all(checks.map(check => check()))

  const failed = results.find(r => !r.success)
  if (failed) {
    return failed
  }

  return results[0]
}

export function createRateLimitHeaders(result: RateLimitResult): HeadersInit {
  const headers: HeadersInit = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  }

  if (result.retryAfter) {
    headers["Retry-After"] = result.retryAfter.toString()
  }

  return headers
}

export function createRateLimitResponse(
  message: string = "Too many requests",
  result: RateLimitResult
): Response {
  return new Response(
    JSON.stringify({
      error: message,
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...createRateLimitHeaders(result),
      },
    }
  )
}

export async function trackFailedAttempts(
  identifier: string,
  maxAttempts: number = 10,
  windowSeconds: number = 3600
): Promise<{ locked: boolean; attempts: number }> {
  if (!isRedisEnabled || !redis) {
    return { locked: false, attempts: 0 }
  }

  try {
    const key = `failed_attempts:${identifier}`
    const attempts = await redis.incr(key)

    if (attempts === 1) {
      await redis.expire(key, windowSeconds)
    }

    const locked = attempts >= maxAttempts

    if (locked) {
      console.warn(`Account locked due to too many failed attempts: ${identifier}`)
    }

    return { locked, attempts }
  } catch (error) {
    console.error("Failed attempts tracking error:", error)
    return { locked: false, attempts: 0 }
  }
}

export async function resetFailedAttempts(identifier: string): Promise<void> {
  if (!isRedisEnabled || !redis) {
    return
  }

  try {
    const key = `failed_attempts:${identifier}`
    await redis.del(key)
  } catch (error) {
    console.error("Failed to reset failed attempts:", error)
  }
}
