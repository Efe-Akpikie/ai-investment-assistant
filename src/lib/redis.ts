import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
})

export { redis }

// Cache helper functions
export async function getCache(key: string) {
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function setCache(key: string, value: any, ttlSeconds: number = 900) {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value))
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function deleteCache(key: string) {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}

export async function getCacheWithFallback<T>(
  key: string,
  fallbackFn: () => Promise<T>,
  ttlSeconds: number = 900
): Promise<T> {
  const cached = await getCache(key)
  if (cached) {
    return cached
  }

  const data = await fallbackFn()
  await setCache(key, data, ttlSeconds)
  return data
}

