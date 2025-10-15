import { z } from 'zod'

export const productResponseSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  price: z.number(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  rating: z.number().nullish(),
  totalSales: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ProductResponse = z.infer<typeof productResponseSchema>
