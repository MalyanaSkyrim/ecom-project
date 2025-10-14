import { z } from 'zod'

// Pagination query schema for request parameters
export const paginationQuerySchema = z.object({
  pageSize: z.coerce.number().min(1).max(100).default(10),
  pageIndex: z.coerce.number().min(0).default(0),
})

// Pagination metadata schema for responses
export const paginationMetaSchema = z.object({
  total: z.number(),
  pageSize: z.number(),
  pageIndex: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
})

// Generic paginated response schema
export const paginationReplySchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: paginationMetaSchema,
  })

// Generated types
export type PaginationQuery = z.infer<typeof paginationQuerySchema>
export type PaginationMeta = z.infer<typeof paginationMetaSchema>
export type PaginationReply<T> = {
  data: T[]
  pagination: PaginationMeta
}
