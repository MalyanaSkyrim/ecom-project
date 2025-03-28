import rateLimit from '@fastify/rate-limit'
import type { FastifyInstance, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import { env } from '../env'
import { redisClient } from '../lib/redis'

const APPLY_RATE_LIMIT_TO_ALL_ROUTES = true
const RATE_LIMIT_MAX = env.RATE_LIMIT_MAX
const RATE_LIMIT_TIME_WINDOW = env.RATE_LIMIT_TIME_WINDOW
const RATE_LIMIT_BAN = -1
const RATE_LIMIT_ALLOW_LIST: string[] = []
const RATE_LIMIT_CACHE = 5000
const DEFAULT_NAME_SPACE = 'ecom-api-sync'

export const rateLimitPlugin = (): FastifyPluginAsync =>
  fp(async (fastify: FastifyInstance) => {
    // quit redis connection on fastify close
    fastify.addHook('onClose', () => {
      return redisClient.quit()
    })

    // register rate limit plugin
    await fastify.register(rateLimit, {
      global: APPLY_RATE_LIMIT_TO_ALL_ROUTES,
      max: RATE_LIMIT_MAX,
      timeWindow: RATE_LIMIT_TIME_WINDOW,
      ban: RATE_LIMIT_BAN,
      allowList: RATE_LIMIT_ALLOW_LIST,
      cache: RATE_LIMIT_CACHE,
      nameSpace: DEFAULT_NAME_SPACE,
      redis: redisClient,
    })

    // set a not-found handler to rate limit the 404 routes
    fastify.setNotFoundHandler(
      { preHandler: fastify.rateLimit() },
      (_, reply) => reply.notFound(),
    )
  })

export default fp(rateLimitPlugin(), {
  name: 'rate-limit',
})
