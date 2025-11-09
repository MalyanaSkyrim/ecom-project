import { z } from 'zod'

// Category reply schema
export const categoryReplySchema = z.object({
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
  search: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
})

// Category params schema
export const categoryParamsSchema = z.object({
  id: z.string(),
})

// Category success reply schema
export const categorySuccessReplySchema = z.object({
  category: categoryReplySchema,
})

// Category list reply schema
export const categoryListReplySchema = z.array(categoryReplySchema)

export type CategoryReply = z.infer<typeof categoryReplySchema>
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>
export type CategoryParams = z.infer<typeof categoryParamsSchema>
export type CategorySuccessReply = z.infer<typeof categorySuccessReplySchema>
export type CategoryListReply = z.infer<typeof categoryListReplySchema>
