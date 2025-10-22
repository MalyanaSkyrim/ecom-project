import { z } from 'zod'

import {
  newsletterSubscriptionResponseSchema,
  newsletterSubscriptionSchema,
} from '@ecom/common'

export const subscribeNewsletterInputSchema = newsletterSubscriptionSchema
export const subscribeNewsletterOutputSchema =
  newsletterSubscriptionResponseSchema

export type SubscribeNewsletterInput = z.infer<
  typeof subscribeNewsletterInputSchema
>
export type SubscribeNewsletterOutput = z.infer<
  typeof subscribeNewsletterOutputSchema
>
