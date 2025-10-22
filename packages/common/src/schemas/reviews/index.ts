import { z } from 'zod'

// Review response schema
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

// Review list query schema
export const reviewListQuerySchema = z.object({
  pageSize: z.number().min(1).max(100).default(10),
  pageIndex: z.number().min(0).default(0),
  productId: z.string().optional(),
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

// Store reviews query schema (without productId)
export const storeReviewsQuerySchema = reviewListQuerySchema.omit({
  productId: true,
})

// Review params schema
export const reviewParamsSchema = z.object({
  id: z.string(),
})

// Review success response schema
export const reviewSuccessResponseSchema = z.object({
  review: reviewResponseSchema,
})

// Review list response schema
export const reviewListResponseSchema = z.object({
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

export type ReviewResponse = z.infer<typeof reviewResponseSchema>
export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>
export type StoreReviewsQuery = z.infer<typeof storeReviewsQuerySchema>
export type ReviewParams = z.infer<typeof reviewParamsSchema>
export type ReviewSuccessResponse = z.infer<typeof reviewSuccessResponseSchema>
export type ReviewListResponse = z.infer<typeof reviewListResponseSchema>
