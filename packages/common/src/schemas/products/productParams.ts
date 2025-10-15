import { z } from 'zod'

export const productParamsSchema = z.object({
  id: z.string().uuid(),
})

export type ProductParams = z.infer<typeof productParamsSchema>
