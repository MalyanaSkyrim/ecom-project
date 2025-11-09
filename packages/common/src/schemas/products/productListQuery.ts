import { z } from 'zod'

import { paginationQuerySchema } from '../common'

// Sorting schema for dynamic ordering
const sortFieldSchema = z.object({
  id: z.string(),
  direction: z.enum(['asc', 'desc']),
})

export const productListQuerySchema = paginationQuerySchema.extend({
  isFeatured: z.coerce.boolean().optional(),
  searchText: z.string().min(1).max(255).optional(),
  sorting: z.array(sortFieldSchema).optional(),
  categoryId: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
})

export type ProductListQuery = z.infer<typeof productListQuerySchema>
