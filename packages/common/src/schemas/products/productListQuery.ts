import { z } from 'zod'

import { paginationQuerySchema } from '../common/paginationQuery'

export const productListQuerySchema = paginationQuerySchema.extend({
  isFeatured: z.coerce.boolean().optional(),
  searchText: z.string().min(1).max(255).optional(),
})

export type ProductListQuery = z.infer<typeof productListQuerySchema>
