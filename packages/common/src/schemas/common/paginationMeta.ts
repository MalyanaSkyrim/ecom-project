import { z } from 'zod'

export const paginationMetaSchema = z.object({
  totalCount: z.number(),
  pageSize: z.number(),
  pageIndex: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
})

export type PaginationMeta = z.infer<typeof paginationMetaSchema>
