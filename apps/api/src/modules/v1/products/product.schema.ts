import { FastifySchema } from 'fastify'
import { z } from 'zod'

import { buildJsonSchemas } from '../../../lib/buildJsonSchema'
import {
  paginationQuerySchema,
  paginationReplySchema,
} from '../../../utils/pagination'
import { bindExamples } from '../../../utils/swagger'

// Base product schema
export const productSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  price: z.number(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  rating: z.number().nullish(),
  totalSales: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Product creation schema
const createProductBodySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().max(1000).nullish(),
  price: z.number().positive(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

// Product update schema
const updateProductBodySchema = createProductBodySchema.partial()

// Product list query schema
const productListQuerySchema = paginationQuerySchema.extend({
  isFeatured: z.coerce.boolean().optional(),
  searchText: z.string().min(1).max(255).optional(),
})

// Product params schema (for /:id routes)
const productParamsSchema = z.object({
  id: z.string().uuid(),
})

// Response schemas
const productResponseSchema = productSchema
const productListResponseSchema = paginationReplySchema(productResponseSchema)
const productSuccessReplySchema = z.object({
  product: productResponseSchema,
})

const productErrorReplySchema = z
  .object({
    message: z.string(),
  })
  .meta({ description: 'Reply for product operations' })

// Generated types
export type Product = z.infer<typeof productSchema>
export type CreateProductInput = z.infer<typeof createProductBodySchema>
export type UpdateProductInput = z.infer<typeof updateProductBodySchema>
export type ProductListQuery = z.infer<typeof productListQuerySchema>
export type ProductParams = z.infer<typeof productParamsSchema>
export type ProductResponse = z.infer<typeof productResponseSchema>
export type ProductListResponse = z.infer<typeof productListResponseSchema>
export type ProductSuccessOutput = z.infer<typeof productSuccessReplySchema>
export type ProductErrorOutput = z.infer<typeof productErrorReplySchema>

// Examples for documentation
const productExample: ProductResponse = {
  id: 'clx1234567890abcdef',
  storeId: 'clx0987654321fedcba',
  name: 'Premium Wireless Headphones',
  slug: 'premium-wireless-headphones',
  description: 'High-quality wireless headphones with noise cancellation',
  price: 299.99,
  isActive: true,
  isFeatured: true,
  rating: 4.5,
  totalSales: 150,
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-20T14:45:00Z'),
}

const productListExample: ProductListResponse = {
  data: [productExample],
  pagination: {
    total: 1,
    pageSize: 10,
    pageIndex: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}

const productErrorExample: ProductErrorOutput = {
  message: 'Product not found',
}

const schemaExamples = {
  productExample,
  productListExample,
  productErrorExample,
}

// Generate JSON schemas
export const { schemas: productSchemas, $ref: productRef } = buildJsonSchemas(
  {
    createProductBodySchema,
    updateProductBodySchema,
    productListQuerySchema,
    productParamsSchema,
    productResponseSchema,
    productListResponseSchema,
    productSuccessReplySchema,
    productErrorReplySchema,
  },
  { $id: 'productSchemas', target: 'openApi3' },
)

// Bind examples to schemas
bindExamples(productSchemas, schemaExamples)

// Fastify schemas for each endpoint
export const createProductSchema: FastifySchema = {
  tags: ['Products'],
  description: 'Create a new product',
  security: [{ apiKey: [] }],
  summary: 'Create a new product',
  operationId: 'createProduct',
  body: productRef('createProductBodySchema'),
  response: {
    '201': productRef('productSuccessReplySchema'),
    '400': productRef('productErrorReplySchema'),
    '500': productRef('productErrorReplySchema'),
  },
}

export const getProductSchema: FastifySchema = {
  tags: ['Products'],
  description: 'Get a product by ID',
  security: [{ apiKey: [] }],
  summary: 'Get a single product',
  operationId: 'getProduct',
  params: productRef('productParamsSchema'),
  response: {
    '200': productRef('productSuccessReplySchema'),
    '404': productRef('productErrorReplySchema'),
    '500': productRef('productErrorReplySchema'),
  },
}

export const updateProductSchema: FastifySchema = {
  tags: ['Products'],
  description: 'Update a product by ID',
  security: [{ apiKey: [] }],
  summary: 'Update an existing product',
  operationId: 'updateProduct',
  params: productRef('productParamsSchema'),
  body: productRef('updateProductBodySchema'),
  response: {
    '200': productRef('productSuccessReplySchema'),
    '404': productRef('productErrorReplySchema'),
    '500': productRef('productErrorReplySchema'),
  },
}

export const deleteProductSchema: FastifySchema = {
  tags: ['Products'],
  description: 'Delete a product by ID',
  security: [{ apiKey: [] }],
  summary: 'Delete a product',
  operationId: 'deleteProduct',
  params: productRef('productParamsSchema'),
  response: {
    '204': {
      type: 'null',
      description: 'Product deleted successfully',
    },
    '404': productRef('productErrorReplySchema'),
    '500': productRef('productErrorReplySchema'),
  },
}

export const getProductsSchema: FastifySchema = {
  tags: ['Products'],
  description: 'Get a paginated list of products',
  security: [{ apiKey: [] }],
  summary: 'Get products with pagination and filtering',
  operationId: 'getProducts',
  querystring: productRef('productListQuerySchema'),
  response: {
    '200': productRef('productListResponseSchema'),
    '400': productRef('productErrorReplySchema'),
    '500': productRef('productErrorReplySchema'),
  },
}
