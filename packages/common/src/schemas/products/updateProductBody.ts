import { z } from 'zod'

export const updateProductBodySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).nullish().optional(),
  price: z.number().positive().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export type UpdateProductInput = z.infer<typeof updateProductBodySchema>
