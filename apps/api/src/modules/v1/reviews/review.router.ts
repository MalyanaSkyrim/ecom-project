import { FastifyPluginAsync } from 'fastify'

import {
  createReviewHandler,
  deleteReviewHandler,
  getProductReviewStatsHandler,
  getProductReviewsHandler,
  getReviewHandler,
  getReviewsHandler,
  getStoreReviewStatsHandler,
  getStoreReviewsHandler,
  updateReviewHandler,
} from './review.controller'
import {
  createReviewSchema,
  deleteReviewSchema,
  getReviewSchema,
  getReviewsSchema,
  updateReviewSchema,
  reviewRef,
} from './review.schema'

/**
 * Review routes plugin
 * Provides CRUD operations for reviews with pagination and filtering
 */
const reviewRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // GET /reviews - List reviews with pagination and filtering
  fastify.get(
    '/',
    {
      schema: getReviewsSchema,
    },
    getReviewsHandler,
  )

  // GET /reviews/stats - Get store review statistics
  fastify.get(
    '/stats',
    {
      schema: {
        tags: ['Reviews'],
        description: 'Get store review statistics',
        security: [{ apiKey: [] }],
        summary: 'Get store review statistics',
        operationId: 'getStoreReviewStats',
        response: {
          '200': {
            type: 'object',
            properties: {
              stats: {
                type: 'object',
                properties: {
                  totalReviews: { type: 'number' },
                  averageRating: { type: 'number', nullable: true },
                  minRating: { type: 'number', nullable: true },
                  maxRating: { type: 'number', nullable: true },
                },
              },
            },
          },
          '500': reviewRef('errorReplySchema'),
        },
      },
    },
    getStoreReviewStatsHandler,
  )

  // GET /reviews/store - Get store reviews (reviews without productId)
  fastify.get(
    '/store',
    {
      schema: {
        tags: ['Reviews'],
        description: 'Get store reviews',
        security: [{ apiKey: [] }],
        summary: 'Get store reviews',
        operationId: 'getStoreReviews',
        querystring: {
          type: 'object',
          properties: {
            pageSize: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            pageIndex: { type: 'number', minimum: 0, default: 0 },
            customerId: { type: 'string', format: 'uuid' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            sorting: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  direction: { type: 'string', enum: ['asc', 'desc'] },
                },
              },
            },
          },
        },
        response: {
          '200': reviewRef('reviewListResponseSchema'),
          '400': reviewRef('errorReplySchema'),
          '500': reviewRef('errorReplySchema'),
        },
      },
    },
    getStoreReviewsHandler,
  )

  // POST /reviews - Create a new review
  fastify.post(
    '/',
    {
      schema: createReviewSchema,
    },
    createReviewHandler,
  )

  // GET /reviews/:id - Get a single review by ID
  fastify.get(
    '/:id',
    {
      schema: getReviewSchema,
    },
    getReviewHandler,
  )

  // PUT /reviews/:id - Update a review by ID
  fastify.put(
    '/:id',
    {
      schema: updateReviewSchema,
    },
    updateReviewHandler,
  )

  // DELETE /reviews/:id - Delete a review by ID
  fastify.delete(
    '/:id',
    {
      schema: deleteReviewSchema,
    },
    deleteReviewHandler,
  )

  // GET /reviews/product/:productId - Get reviews for a specific product
  fastify.get(
    '/product/:productId',
    {
      schema: {
        tags: ['Reviews'],
        description: 'Get reviews for a specific product',
        security: [{ apiKey: [] }],
        summary: 'Get product reviews',
        operationId: 'getProductReviews',
        params: {
          type: 'object',
          properties: {
            productId: { type: 'string', format: 'uuid' },
          },
          required: ['productId'],
        },
        querystring: {
          type: 'object',
          properties: {
            pageSize: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            pageIndex: { type: 'number', minimum: 0, default: 0 },
            customerId: { type: 'string', format: 'uuid' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            sorting: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  direction: { type: 'string', enum: ['asc', 'desc'] },
                },
              },
            },
          },
        },
        response: {
          '200': reviewRef('reviewListResponseSchema'),
          '400': reviewRef('errorReplySchema'),
          '500': reviewRef('errorReplySchema'),
        },
      },
    },
    getProductReviewsHandler,
  )

  // GET /reviews/product/:productId/stats - Get review statistics for a product
  fastify.get(
    '/product/:productId/stats',
    {
      schema: {
        tags: ['Reviews'],
        description: 'Get review statistics for a product',
        security: [{ apiKey: [] }],
        summary: 'Get product review statistics',
        operationId: 'getProductReviewStats',
        params: {
          type: 'object',
          properties: {
            productId: { type: 'string', format: 'uuid' },
          },
          required: ['productId'],
        },
        response: {
          '200': {
            type: 'object',
            properties: {
              stats: {
                type: 'object',
                properties: {
                  totalReviews: { type: 'number' },
                  averageRating: { type: 'number', nullable: true },
                  minRating: { type: 'number', nullable: true },
                  maxRating: { type: 'number', nullable: true },
                },
              },
            },
          },
          '500': reviewRef('errorReplySchema'),
        },
      },
    },
    getProductReviewStatsHandler,
  )
}

export default reviewRoutes
