import { FastifyPluginAsync } from 'fastify'

import { healthHandler } from './health.controller'
import { schema } from './health.schema'

/**
 * @todo add a check for each database and redis connection
 */
const healthCheck: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get(
    '/',
    {
      schema,
    },
    healthHandler,
  )
}

export default healthCheck
