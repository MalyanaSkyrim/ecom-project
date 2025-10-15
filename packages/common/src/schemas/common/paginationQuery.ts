import { z } from 'zod'

export const paginationQuerySchema = z.object({
  pageSize: z.coerce.number().min(1).max(100).default(10),
  pageIndex: z.coerce.number().min(0).default(0),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>
