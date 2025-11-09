import { FastifySchema } from 'fastify'
import z from 'zod'

import { buildJsonSchemas } from '../../../lib/buildJsonSchema'
import { bindExamples } from '../../../utils/swagger'

// Base category schema
export const categorySchema = z.object({
  id: z.string(),
  storeId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  parentId: z.string().nullish(),
  tags: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Input schemas
export const createCategoryBodySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})

export const updateCategoryBodySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

export const categoryParamsSchema = z.object({
  id: z.string().uuid('Invalid category ID format'),
})

export const categoryListQuerySchema = z.object({
  searchText: z.string().optional(),
  parentId: z.string().uuid().optional(),
  isActive: z.coerce.boolean().optional(),
})

// Reply schemas
export const categoryReplySchema = categorySchema
export const categoryListReplySchema = z.array(categoryReplySchema)

export const categorySuccessReplySchema = z.object({
  category: categoryReplySchema,
})

export const errorReplySchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  meta: z.record(z.string(), z.any()).optional(),
})

// Generated types
export type Category = z.infer<typeof categorySchema>
export type CreateCategoryInput = z.infer<typeof createCategoryBodySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategoryBodySchema>
export type CategoryParams = z.infer<typeof categoryParamsSchema>
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>
export type CategoryReply = z.infer<typeof categoryReplySchema>
export type CategoryListReply = z.infer<typeof categoryListReplySchema>
export type CategorySuccessOutput = z.infer<typeof categorySuccessReplySchema>
export type CategoryErrorOutput = z.infer<typeof errorReplySchema>

// Examples for documentation
const categoryExample = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  storeId: 'abcd-1234-5678-90ab-cdef-1234-5678-90ab',
  name: 'Electronics',
  slug: 'electronics',
  description: 'Electronic devices and accessories',
  imageUrl: 'https://example.com/electronics.jpg',
  parentId: null,
  tags: ['tech', 'devices'],
  isActive: true,
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-20T14:45:00Z'),
}

const categoryListExample: CategoryListReply = [categoryExample]

const categoryErrorExample: CategoryErrorOutput = {
  message: 'Category not found',
  code: 'CATEGORY_NOT_FOUND',
}

const schemaExamples = {
  categoryExample,
  categoryListExample,
  categoryErrorExample,
}

// Generate JSON schemas
export const { schemas: categorySchemas, $ref: categoryRef } = buildJsonSchemas(
  {
    createCategoryBodySchema,
    updateCategoryBodySchema,
    categoryListQuerySchema,
    categoryParamsSchema,
    categoryReplySchema,
    categoryListReplySchema,
    categorySuccessReplySchema,
    errorReplySchema,
  },
  { $id: 'categorySchemas', target: 'openApi3' },
)

// Bind examples to schemas
bindExamples(categorySchemas, schemaExamples)

// Fastify schemas for each endpoint
export const createCategorySchema: FastifySchema = {
  tags: ['Categories'],
  description: 'Create a new category',
  security: [{ apiKey: [] }],
  summary: 'Create a new category',
  operationId: 'createCategory',
  body: categoryRef('createCategoryBodySchema'),
  response: {
    '201': categoryRef('categorySuccessReplySchema'),
    '400': categoryRef('errorReplySchema'),
    '500': categoryRef('errorReplySchema'),
  },
}

export const getCategorySchema: FastifySchema = {
  tags: ['Categories'],
  description: 'Get a category by ID',
  security: [{ apiKey: [] }],
  summary: 'Get a single category',
  operationId: 'getCategory',
  params: categoryRef('categoryParamsSchema'),
  response: {
    '200': categoryRef('categorySuccessReplySchema'),
    '404': categoryRef('errorReplySchema'),
    '500': categoryRef('errorReplySchema'),
  },
}

export const updateCategorySchema: FastifySchema = {
  tags: ['Categories'],
  description: 'Update a category by ID',
  security: [{ apiKey: [] }],
  summary: 'Update an existing category',
  operationId: 'updateCategory',
  params: categoryRef('categoryParamsSchema'),
  body: categoryRef('updateCategoryBodySchema'),
  response: {
    '200': categoryRef('categorySuccessReplySchema'),
    '404': categoryRef('errorReplySchema'),
    '500': categoryRef('errorReplySchema'),
  },
}

export const deleteCategorySchema: FastifySchema = {
  tags: ['Categories'],
  description: 'Delete a category by ID',
  security: [{ apiKey: [] }],
  summary: 'Delete a category',
  operationId: 'deleteCategory',
  params: categoryRef('categoryParamsSchema'),
  response: {
    '204': {
      type: 'null',
      description: 'Category deleted successfully',
    },
    '404': categoryRef('errorReplySchema'),
    '500': categoryRef('errorReplySchema'),
  },
}

export const getCategoriesSchema: FastifySchema = {
  tags: ['Categories'],
  description: 'Get categories with optional pagination and filtering',
  security: [{ apiKey: [] }],
  summary: 'Get categories',
  operationId: 'getCategories',
  querystring: categoryRef('categoryListQuerySchema'),
  response: {
    '200': categoryRef('categoryListReplySchema'),
    '400': categoryRef('errorReplySchema'),
    '500': categoryRef('errorReplySchema'),
  },
}
