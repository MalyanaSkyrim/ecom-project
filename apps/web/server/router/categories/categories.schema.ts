import { z } from 'zod'

// Category response schema matching the API
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

// Categories list response schema
export const categoriesListResponseSchema = z.object({
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

// Query schema for categories
export const categoriesQuerySchema = z.object({
  pageSize: z.number().min(1).max(100).default(10),
  pageIndex: z.number().min(0).default(0),
  search: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type CategoryResponse = z.infer<typeof categoryResponseSchema>
export type CategoriesListResponse = z.infer<
  typeof categoriesListResponseSchema
>
export type CategoriesQuery = z.infer<typeof categoriesQuerySchema>
