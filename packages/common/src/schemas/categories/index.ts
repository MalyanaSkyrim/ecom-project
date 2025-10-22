import { z } from 'zod'

// Category response schema
export const categoryResponseSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  parentId: z.string().nullable(),
  tags: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Category list query schema
export const categoryListQuerySchema = z.object({
  pageSize: z.number().min(1).max(100).default(10),
  pageIndex: z.number().min(0).default(0),
  search: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
})

// Category params schema
export const categoryParamsSchema = z.object({
  id: z.string(),
})

// Category success response schema
export const categorySuccessResponseSchema = z.object({
  category: categoryResponseSchema,
})

// Category list response schema
export const categoryListResponseSchema = z.object({
  data: z.array(categoryResponseSchema),
  pagination: z.object({
    totalCount: z.number(),
    pageSize: z.number(),
    pageIndex: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
})

export type CategoryResponse = z.infer<typeof categoryResponseSchema>
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>
export type CategoryParams = z.infer<typeof categoryParamsSchema>
export type CategorySuccessResponse = z.infer<
  typeof categorySuccessResponseSchema
>
export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>
