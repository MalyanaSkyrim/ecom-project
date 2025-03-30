'use strict'

import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import Redis from 'ioredis'

import { env } from '../env'

declare module 'fastify' {
  export interface FastifyInstance {
    redis: Redis
  }
}

const REDIS_MAX_RETRIES = 10

const fastifyRedis = async (fastify: FastifyInstance) => {
  if (fastify.redis) return

  try {
    const redisClient = new Redis({
      port: env.REDIS_PORT,
      host: env.REDIS_HOST,
      maxRetriesPerRequest: REDIS_MAX_RETRIES,
    })

    /**
     * Close redis connection and remove error listener
     * if host cannot be resolved.
     */
    const onError = (err: Error & { code?: string }) => {
      if (err.code === 'ENOTFOUND') {
        redisClient.off('error', onError).quit()
        return
      }
    }

    redisClient.on('error', onError)

    fastify.decorate('redis', redisClient)
    fastify.addHook('onClose', (instance) => {
      return instance.redis.quit()
    })
  } catch (error) {
    fastify.log.error(error)
  }
}

export default fp(fastifyRedis, {
  fastify: '5.x',
  name: 'fastify-redis',
})
