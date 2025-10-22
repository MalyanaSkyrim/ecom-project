import { RouteHandler } from 'fastify'

import {
  NewsletterSubscriptionFailedError,
  StoreIdRequiredError,
} from '../../../lib/error'
import type { NewsletterSubscriptionInput } from './newsletter.schema'
import { subscribeToNewsletter } from './newsletter.services'

// Subscribe to newsletter handler
export const subscribeToNewsletterHandler: RouteHandler<{
  Body: NewsletterSubscriptionInput
}> = async (req, reply) => {
  const data = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  try {
    const result = await subscribeToNewsletter(storeId, data)
    return reply.code(200).send(result)
  } catch (error) {
    throw new NewsletterSubscriptionFailedError({
      message:
        'Failed to subscribe to newsletter. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        storeId,
        email: data.email,
      },
    })
  }
}
