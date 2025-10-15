import { FastifySchema } from 'fastify'
import z from 'zod'

import {
  createProductBodySchema,
  errorReplySchema,
  paginationReplySchema,
  productListQuerySchema,
  productParamsSchema,
  productResponseSchema,
  updateProductBodySchema,
} from '@ecom/common'

import { buildJsonSchemas } from '../../../lib/buildJsonSchema'
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

// Response schemas
const productListResponseSchema = paginationReplySchema(productResponseSchema)
const productSuccessReplySchema = z.object({
  product: productResponseSchema,
})

// Re-export schemas from common package
export {
  createProductBodySchema,
  productListQuerySchema,
  productParamsSchema,
  productResponseSchema,
  updateProductBodySchema,
}

// Generated types
export type Product = z.infer<typeof productSchema>
export type ProductListResponse = z.infer<typeof productListResponseSchema>
export type ProductSuccessOutput = z.infer<typeof productSuccessReplySchema>
export type ProductErrorOutput = z.infer<typeof errorReplySchema>

// Re-export types from common
export type {
  CreateProductInput,
  ProductListQuery,
  ProductParams,
  ProductResponse,
  UpdateProductInput,
} from '@ecom/common'

// Examples for documentation
const productExample = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  storeId: 'abcd-1234-5678-90ab-cdef-1234-5678-90ab',
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
    totalCount: 1,
    pageSize: 10,
    pageIndex: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}

const productErrorExample: ProductErrorOutput = {
  message: 'Product not found',
  code: 'PRODUCT_NOT_FOUND',
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
    errorReplySchema,
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
    '400': productRef('errorReplySchema'),
    '500': productRef('errorReplySchema'),
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
    '404': productRef('errorReplySchema'),
    '500': productRef('errorReplySchema'),
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
    '404': productRef('errorReplySchema'),
    '500': productRef('errorReplySchema'),
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
    '404': productRef('errorReplySchema'),
    '500': productRef('errorReplySchema'),
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
    '400': productRef('errorReplySchema'),
    '500': productRef('errorReplySchema'),
  },
}
