import z from 'zod'

export const createProductBodySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().max(1000).nullish(),
  price: z.number().positive(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export type CreateProductInput = z.infer<typeof createProductBodySchema>
