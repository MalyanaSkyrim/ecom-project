import Redis from 'ioredis'

import { env } from '../env'

const REDIS_MAX_RETRIES = 10

const redisClientProvider = (): Redis => {
  const redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: REDIS_MAX_RETRIES,
  })

  // handle redis connection error
  const onError = (err: Error & { code?: string }) => {
    if (err.code === 'ENOTFOUND') {
      redisClient.off('error', onError).quit()
      return
    }
  }
  redisClient.on('error', onError)

  return redisClient
}

export const redisClient = redisClientProvider()
