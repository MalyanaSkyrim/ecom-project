import fp from 'fastify-plugin'

import { errorHandler } from '../lib/error/errorHandler'

export default fp(
  async (fastify) => {
    // Set global error handler - this will catch all errors except validation errors
    fastify.setErrorHandler(errorHandler)
  },
  {
    name: 'error-handler',
    fastify: '5.x',
  },
)
