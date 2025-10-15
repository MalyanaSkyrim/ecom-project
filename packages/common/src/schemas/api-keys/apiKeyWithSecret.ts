import { z } from 'zod'

export const apiKeyWithSecretSchema = z.object({
  id: z.string(),
  name: z.string(),
  keyPrefix: z.string(),
  apiKey: z.string(), // Only returned when creating a new key
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ApiKeyWithSecret = z.infer<typeof apiKeyWithSecretSchema>
