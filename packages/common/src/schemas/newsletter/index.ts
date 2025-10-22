import { z } from 'zod'

export const newsletterSubscriptionSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const newsletterSubscriptionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  isSubscribed: z.boolean(),
})

export type NewsletterSubscriptionInput = z.infer<
  typeof newsletterSubscriptionSchema
>
export type NewsletterSubscriptionResponse = z.infer<
  typeof newsletterSubscriptionResponseSchema
>
