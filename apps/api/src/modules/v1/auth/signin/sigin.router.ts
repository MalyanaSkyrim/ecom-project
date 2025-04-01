import { FastifyPluginAsync } from 'fastify'

import { signinHandler } from './signin.controller'
import { schema } from './signin.schema'

/**
 * @todo add a check for each database and redis connection
 */
const signin: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post(
    '/',
    {
      schema,
    },
    signinHandler,
  )
}

export default signin
