import { FastifyPluginAsync } from 'fastify'

import { subscribeToNewsletterHandler } from './newsletter.controller'
import { subscribeNewsletterSchema } from './newsletter.schema'

/**
 * Newsletter routes plugin
 * Provides newsletter subscription operations
 */
const newsletterRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // POST /newsletter/subscribe - Subscribe to newsletter
  fastify.post(
    '/subscribe',
    {
      schema: subscribeNewsletterSchema,
    },
    subscribeToNewsletterHandler,
  )
}

export default newsletterRoutes
