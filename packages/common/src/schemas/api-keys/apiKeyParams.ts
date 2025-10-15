import { z } from 'zod'

export const apiKeyParamsSchema = z.object({
  id: z.string().uuid(),
})

export type ApiKeyParams = z.infer<typeof apiKeyParamsSchema>
