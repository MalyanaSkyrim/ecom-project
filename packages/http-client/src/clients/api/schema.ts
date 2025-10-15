import { createSchema } from '@better-fetch/fetch'
import z from 'zod'

import {
  apiKeyParamsSchema,
  apiKeyResponseSchema,
  apiKeyWithSecretSchema,
  // API Key schemas
  createApiKeyBodySchema,
  // Product schemas
  createProductBodySchema,
  // Common schemas
  errorReplySchema,
  paginationReplySchema,
  productListQuerySchema,
  productParamsSchema,
  productResponseSchema,
  // Auth schemas
  signinBodySchema,
  signinSuccessReplySchema,
  signupBodySchema,
  signupSuccessReplySchema,
  updateProductBodySchema,
} from '@ecom/common'

// Create paginated product list response schema
const productListResponseSchema = paginationReplySchema(productResponseSchema)

// Create product success response schema
const productSuccessResponseSchema = z.object({
  product: productResponseSchema,
})

// Create API key list response schema
const apiKeyListResponseSchema = z.object({
  apiKeys: z.array(apiKeyResponseSchema),
})

// Create API key success response schema
const createApiKeySuccessResponseSchema = z.object({
  apiKey: apiKeyWithSecretSchema,
})

// Empty response schema for DELETE operations
const emptyResponseSchema = z.object({})

export const apiSchema = createSchema(
  {
    // Product endpoints
    '@get/v1/products': {
      query: productListQuerySchema,
      output: productListResponseSchema,
    },
    '@post/v1/products': {
      body: createProductBodySchema,
      output: productSuccessResponseSchema,
    },
    '@get/v1/products/:id': {
      params: productParamsSchema,
      output: productSuccessResponseSchema,
    },
    '@put/v1/products/:id': {
      params: productParamsSchema,
      body: updateProductBodySchema,
      output: productSuccessResponseSchema,
    },
    '@delete/v1/products/:id': {
      params: productParamsSchema,
      output: emptyResponseSchema,
    },

    // Auth endpoints
    '@post/v1/auth/signin': {
      body: signinBodySchema,
      output: signinSuccessReplySchema,
    },
    '@post/v1/auth/signup': {
      body: signupBodySchema,
      output: signupSuccessReplySchema,
    },

    // API Key endpoints
    '@get/v1/api-keys': {
      output: apiKeyListResponseSchema,
    },
    '@post/v1/api-keys': {
      body: createApiKeyBodySchema,
      output: createApiKeySuccessResponseSchema,
    },
    '@put/v1/api-keys/:id/deactivate': {
      params: apiKeyParamsSchema,
      output: emptyResponseSchema,
    },

    // Error responses (for all endpoints)
    error: {
      output: errorReplySchema,
    },
  },
  {
    strict: true,
  },
)
