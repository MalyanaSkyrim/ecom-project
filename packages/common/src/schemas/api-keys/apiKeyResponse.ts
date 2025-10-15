import { z } from 'zod'

export const apiKeyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  keyPrefix: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ApiKeyResponse = z.infer<typeof apiKeyResponseSchema>
