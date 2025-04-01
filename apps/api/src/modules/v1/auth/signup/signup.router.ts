import { FastifyPluginAsync } from 'fastify'

import { signupHandler } from './signup.controller'
import { schema } from './signup.schema'

/**
 * @todo add a check for each database and redis connection
 */
const signup: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post(
    '/',
    {
      schema,
    },
    signupHandler,
  )
}

export default signup
