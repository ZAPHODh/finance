import { Redis } from '@upstash/redis'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

export const isRedisEnabled = !!(REDIS_URL && REDIS_TOKEN)

export const redis = isRedisEnabled
  ? new Redis({
      url: REDIS_URL,
      token: REDIS_TOKEN,
    })
  : null

export async function getCached<T>(key: string): Promise<T | null> {
  if (!isRedisEnabled || !redis) return null

  try {
    const cached = await redis.get<T>(key)
    return cached
  } catch (error) {
    console.error('Redis GET error:', error)
    return null
  }
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<void> {
  if (!isRedisEnabled || !redis) return

  try {
    if (ttlSeconds) {
      await redis.set(key, value, { ex: ttlSeconds })
    } else {
      await redis.set(key, value)
    }
  } catch (error) {
    console.error('Redis SET error:', error)
  }
}

export async function deleteCached(key: string): Promise<void> {
  if (!isRedisEnabled || !redis) return

  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis DEL error:', error)
  }
}

export async function deleteCachedByPattern(pattern: string): Promise<void> {
  if (!isRedisEnabled || !redis) return

  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Redis DELETE pattern error:', error)
  }
}

export async function invalidateCacheByTag(tag: string): Promise<void> {
  await deleteCachedByPattern(`*:${tag}:*`)
}
