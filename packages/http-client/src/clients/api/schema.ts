import { createSchema } from '@better-fetch/fetch'
import z from 'zod'

import {
  apiKeyParamsSchema,
  apiKeyResponseSchema,
  apiKeyWithSecretSchema,
  // Category schemas
  categoryListQuerySchema,
  categoryListReplySchema,
  categoryParamsSchema,
  categorySuccessReplySchema,
  // API Key schemas
  createApiKeyBodySchema,
  // Product schemas
  createProductBodySchema,
  // Common schemas
  errorReplySchema,
  newsletterSubscriptionResponseSchema,
  // Newsletter schemas
  newsletterSubscriptionSchema,
  paginationReplySchema,
  productListQuerySchema,
  productParamsSchema,
  productResponseSchema,
  // Review schemas
  reviewListQuerySchema,
  reviewListResponseSchema,
  reviewParamsSchema,
  reviewSuccessResponseSchema,
  // Auth schemas
  signinBodySchema,
  signinSuccessReplySchema,
  signupBodySchema,
  signupSuccessReplySchema,
  storeReviewsQuerySchema,
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

    // Category endpoints
    '@get/v1/categories': {
      query: categoryListQuerySchema,
      output: categoryListReplySchema,
    },
    '@get/v1/categories/:id': {
      params: categoryParamsSchema,
      output: categorySuccessReplySchema,
    },

    // Review endpoints
    '@get/v1/reviews': {
      query: reviewListQuerySchema,
      output: reviewListResponseSchema,
    },
    '@get/v1/reviews/store': {
      query: storeReviewsQuerySchema,
      output: reviewListResponseSchema,
    },
    '@get/v1/reviews/:id': {
      params: reviewParamsSchema,
      output: reviewSuccessResponseSchema,
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

    // Newsletter endpoints
    '@post/v1/newsletter/subscribe': {
      body: newsletterSubscriptionSchema,
      output: newsletterSubscriptionResponseSchema,
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
