import { FastifySchema } from 'fastify'
import { z } from 'zod'

import {
  errorReplySchema,
  newsletterSubscriptionResponseSchema,
  newsletterSubscriptionSchema,
} from '@ecom/common'

import { buildJsonSchemas } from '../../../lib/buildJsonSchema'
import { bindExamples } from '../../../utils/swagger'

// Re-export schemas from common package
export { newsletterSubscriptionResponseSchema, newsletterSubscriptionSchema }

// Response schemas
const subscribeNewsletterSuccessReplySchema = z.object({
  success: z.boolean(),
  message: z.string(),
  isSubscribed: z.boolean(),
})

// Generated types
export type SubscribeNewsletterSuccessOutput = z.infer<
  typeof subscribeNewsletterSuccessReplySchema
>
export type NewsletterErrorOutput = z.infer<typeof errorReplySchema>

// Re-export types from common
export type {
  NewsletterSubscriptionInput,
  NewsletterSubscriptionResponse,
} from '@ecom/common'

// Examples for documentation
const newsletterExample = {
  success: true,
  message: 'Successfully subscribed to newsletter!',
  isSubscribed: true,
}

const newsletterErrorExample: NewsletterErrorOutput = {
  message: 'Email already subscribed',
  code: 'EMAIL_ALREADY_SUBSCRIBED',
}

const schemaExamples = {
  newsletterExample,
  newsletterErrorExample,
}

// Build JSON schemas for OpenAPI
export const { schemas: newsletterSchemas, $ref: newsletterRef } =
  buildJsonSchemas(
    {
      newsletterSubscriptionSchema,
      newsletterSubscriptionResponseSchema,
      subscribeNewsletterSuccessReplySchema,
      errorReplySchema,
    },
    { $id: 'newsletterSchemas', target: 'openApi3' },
  )

// Fastify schemas
export const subscribeNewsletterSchema: FastifySchema = {
  tags: ['Newsletter'],
  description: 'Subscribe to newsletter',
  security: [{ apiKey: [] }],
  summary: 'Subscribe to newsletter',
  operationId: 'subscribeNewsletter',
  body: newsletterRef('newsletterSubscriptionSchema'),
  response: {
    '200': newsletterRef('subscribeNewsletterSuccessReplySchema'),
    '400': newsletterRef('errorReplySchema'),
    '500': newsletterRef('errorReplySchema'),
  },
}

// Bind examples to schemas
bindExamples(newsletterSchemas, schemaExamples)
