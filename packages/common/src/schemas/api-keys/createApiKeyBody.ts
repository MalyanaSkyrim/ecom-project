import { z } from 'zod'

export const createApiKeyBodySchema = z.object({
  name: z.string().min(1).max(255),
})

export type CreateApiKeyInput = z.infer<typeof createApiKeyBodySchema>
