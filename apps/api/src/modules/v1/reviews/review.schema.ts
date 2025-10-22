import { FastifySchema } from 'fastify'
import z from 'zod'

import { buildJsonSchemas } from '../../../lib/buildJsonSchema'
import { bindExamples } from '../../../utils/swagger'

// Base review schema
export const reviewSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  customerId: z.string(),
  productId: z.string().nullish(),
  content: z.string(),
  rating: z.number().min(1).max(5),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Input schemas
export const createReviewBodySchema = z.object({
  customerId: z.string().uuid('Invalid customer ID format'),
  productId: z.string().uuid('Invalid product ID format').optional(),
  content: z
    .string()
    .min(10, 'Review content must be at least 10 characters')
    .max(1000, 'Review content must not exceed 1000 characters'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
})

export const updateReviewBodySchema = z.object({
  content: z.string().min(10).max(1000).optional(),
  rating: z.number().min(1).max(5).optional(),
})

export const reviewParamsSchema = z.object({
  id: z.string().uuid('Invalid review ID format'),
})

export const reviewListQuerySchema = z.object({
  pageSize: z.coerce.number().min(1).max(100).default(10),
  pageIndex: z.coerce.number().min(0).default(0),
  productId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sorting: z
    .array(
      z.object({
        id: z.string(),
        direction: z.enum(['asc', 'desc']),
      }),
    )
    .optional(),
})

// Response schemas
export const reviewResponseSchema = reviewSchema
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

export const reviewSuccessReplySchema = z.object({
  review: reviewResponseSchema,
})

export const errorReplySchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  meta: z.record(z.string(), z.any()).optional(),
})

// Generated types
export type Review = z.infer<typeof reviewSchema>
export type CreateReviewInput = z.infer<typeof createReviewBodySchema>
export type UpdateReviewInput = z.infer<typeof updateReviewBodySchema>
export type ReviewParams = z.infer<typeof reviewParamsSchema>
export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>
export type ReviewResponse = z.infer<typeof reviewResponseSchema>
export type ReviewListResponse = z.infer<typeof reviewListResponseSchema>
export type ReviewSuccessOutput = z.infer<typeof reviewSuccessReplySchema>
export type ReviewErrorOutput = z.infer<typeof errorReplySchema>

// Examples for documentation
const reviewExample = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  storeId: 'abcd-1234-5678-90ab-cdef-1234-5678-90ab',
  customerId: 'customer-123e4567-e89b-12d3-a456-426614174000',
  productId: 'product-123e4567-e89b-12d3-a456-426614174000',
  content: 'Great product! Highly recommend it to anyone looking for quality.',
  rating: 5,
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-20T14:45:00Z'),
}

const reviewListExample: ReviewListResponse = {
  data: [reviewExample],
  pagination: {
    totalCount: 1,
    pageSize: 10,
    pageIndex: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}

const reviewErrorExample: ReviewErrorOutput = {
  message: 'Review not found',
  code: 'REVIEW_NOT_FOUND',
}

const schemaExamples = {
  reviewExample,
  reviewListExample,
  reviewErrorExample,
}

// Generate JSON schemas
export const { schemas: reviewSchemas, $ref: reviewRef } = buildJsonSchemas(
  {
    createReviewBodySchema,
    updateReviewBodySchema,
    reviewListQuerySchema,
    reviewParamsSchema,
    reviewResponseSchema,
    reviewListResponseSchema,
    reviewSuccessReplySchema,
    errorReplySchema,
  },
  { $id: 'reviewSchemas', target: 'openApi3' },
)

// Bind examples to schemas
bindExamples(reviewSchemas, schemaExamples)

// Fastify schemas for each endpoint
export const createReviewSchema: FastifySchema = {
  tags: ['Reviews'],
  description: 'Create a new review',
  security: [{ apiKey: [] }],
  summary: 'Create a new review',
  operationId: 'createReview',
  body: reviewRef('createReviewBodySchema'),
  response: {
    '201': reviewRef('reviewSuccessReplySchema'),
    '400': reviewRef('errorReplySchema'),
    '500': reviewRef('errorReplySchema'),
  },
}

export const getReviewSchema: FastifySchema = {
  tags: ['Reviews'],
  description: 'Get a review by ID',
  security: [{ apiKey: [] }],
  summary: 'Get a single review',
  operationId: 'getReview',
  params: reviewRef('reviewParamsSchema'),
  response: {
    '200': reviewRef('reviewSuccessReplySchema'),
    '404': reviewRef('errorReplySchema'),
    '500': reviewRef('errorReplySchema'),
  },
}

export const updateReviewSchema: FastifySchema = {
  tags: ['Reviews'],
  description: 'Update a review by ID',
  security: [{ apiKey: [] }],
  summary: 'Update an existing review',
  operationId: 'updateReview',
  params: reviewRef('reviewParamsSchema'),
  body: reviewRef('updateReviewBodySchema'),
  response: {
    '200': reviewRef('reviewSuccessReplySchema'),
    '404': reviewRef('errorReplySchema'),
    '500': reviewRef('errorReplySchema'),
  },
}

export const deleteReviewSchema: FastifySchema = {
  tags: ['Reviews'],
  description: 'Delete a review by ID',
  security: [{ apiKey: [] }],
  summary: 'Delete a review',
  operationId: 'deleteReview',
  params: reviewRef('reviewParamsSchema'),
  response: {
    '204': {
      type: 'null',
      description: 'Review deleted successfully',
    },
    '404': reviewRef('errorReplySchema'),
    '500': reviewRef('errorReplySchema'),
  },
}

export const getReviewsSchema: FastifySchema = {
  tags: ['Reviews'],
  description: 'Get a paginated list of reviews',
  security: [{ apiKey: [] }],
  summary: 'Get reviews with pagination and filtering',
  operationId: 'getReviews',
  querystring: reviewRef('reviewListQuerySchema'),
  response: {
    '200': reviewRef('reviewListResponseSchema'),
    '400': reviewRef('errorReplySchema'),
    '500': reviewRef('errorReplySchema'),
  },
}
