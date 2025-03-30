import Redis from 'ioredis'

import { env } from '../env'

const REDIS_MAX_RETRIES = 10
export const redisConnection = {
  host: env.REDIS_HOST || 'localhost',
  port: Number(env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: REDIS_MAX_RETRIES,
}

const redisClientProvider = (): Redis => {
  const redisClient = new Redis(redisConnection)

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
