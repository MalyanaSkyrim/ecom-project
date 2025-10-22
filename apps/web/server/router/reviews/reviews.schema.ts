import { z } from 'zod'

// Review response schema matching the API
export const reviewResponseSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  customerId: z.string(),
  productId: z.string().nullable(),
  content: z.string(),
  rating: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Reviews list response schema
export const reviewsListResponseSchema = z.object({
  data: z.array(reviewResponseSchema),
  pagination: z.object({
    totalCount: z.number(),
    pageSize: z.number(),
    pageIndex: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
})

// Query schema for store reviews
export const storeReviewsQuerySchema = z.object({
  pageSize: z.number().min(1).max(100).default(10),
  pageIndex: z.number().min(0).default(0),
  customerId: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  sorting: z
    .array(
      z.object({
        id: z.string(),
        direction: z.enum(['asc', 'desc']),
      }),
    )
    .optional(),
})

export type ReviewResponse = z.infer<typeof reviewResponseSchema>
export type ReviewsListResponse = z.infer<typeof reviewsListResponseSchema>
export type StoreReviewsQuery = z.infer<typeof storeReviewsQuerySchema>
