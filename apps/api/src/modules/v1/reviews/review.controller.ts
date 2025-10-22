import { RouteHandler } from 'fastify'

import { db } from '@ecom/database'

import {
  InvalidReviewDataError,
  ReviewCreationFailedError,
  ReviewDeletionFailedError,
  ReviewNotFoundError,
  ReviewUpdateFailedError,
  StoreIdRequiredError,
} from '../../../lib/error'
import type {
  CreateReviewInput,
  ReviewListQuery,
  ReviewParams,
  UpdateReviewInput,
} from './review.schema'
import {
  createReview,
  deleteReview,
  getProductReviewStats,
  getProductReviews,
  getReviewById,
  getReviews,
  getStoreReviewStats,
  getStoreReviews,
  updateReview,
} from './review.services'

// Create review handler
export const createReviewHandler: RouteHandler<{
  Body: CreateReviewInput
}> = async (req, reply) => {
  const data = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  // Validate customer exists in the store
  const customer = await db.customer.findFirst({
    where: {
      id: data.customerId,
      storeId,
    },
  })

  if (!customer) {
    throw new InvalidReviewDataError({
      message: `Customer with ID '${data.customerId}' not found in your store.`,
      meta: { customerId: data.customerId, storeId },
    })
  }

  // Validate product exists in the store (if productId is provided)
  if (data.productId) {
    const product = await db.product.findFirst({
      where: {
        id: data.productId,
        storeId,
      },
    })

    if (!product) {
      throw new InvalidReviewDataError({
        message: `Product with ID '${data.productId}' not found in your store.`,
        meta: { productId: data.productId, storeId },
      })
    }
  }

  try {
    const review = await createReview(storeId, data)
    return reply.code(201).send({ review })
  } catch (error) {
    throw new ReviewCreationFailedError({
      message:
        'Failed to create review. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        storeId,
        reviewData: { customerId: data.customerId, productId: data.productId },
      },
    })
  }
}

// Get review by ID handler
export const getReviewHandler: RouteHandler<{
  Params: ReviewParams
}> = async (req, reply) => {
  const { id } = req.params
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const review = await getReviewById(id, storeId)

  if (!review) {
    throw new ReviewNotFoundError({
      message: `Review with ID '${id}' not found in your store.`,
      meta: { reviewId: id, storeId },
    })
  }

  return reply.code(200).send({ review })
}

// Update review handler
export const updateReviewHandler: RouteHandler<{
  Params: ReviewParams
  Body: UpdateReviewInput
}> = async (req, reply) => {
  const { id } = req.params
  const data = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  try {
    const review = await updateReview(id, storeId, data)

    if (!review) {
      throw new ReviewNotFoundError({
        message: `Review with ID '${id}' not found in your store.`,
        meta: { reviewId: id, storeId },
      })
    }

    return reply.code(200).send({ review })
  } catch (error) {
    if (error instanceof ReviewNotFoundError) {
      throw error
    }
    throw new ReviewUpdateFailedError({
      message:
        'Failed to update review. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        reviewId: id,
        storeId,
        updateData: data,
      },
    })
  }
}

// Delete review handler
export const deleteReviewHandler: RouteHandler<{
  Params: ReviewParams
}> = async (req, reply) => {
  const { id } = req.params
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  try {
    const deleted = await deleteReview(id, storeId)

    if (!deleted) {
      throw new ReviewNotFoundError({
        message: `Review with ID '${id}' not found in your store.`,
        meta: { reviewId: id, storeId },
      })
    }

    return reply.code(204).send(null)
  } catch (error) {
    if (error instanceof ReviewNotFoundError) {
      throw error
    }
    throw new ReviewDeletionFailedError({
      message:
        'Failed to delete review. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        reviewId: id,
        storeId,
      },
    })
  }
}

// Get reviews list handler
export const getReviewsHandler: RouteHandler<{
  Querystring: ReviewListQuery
}> = async (req, reply) => {
  const query = req.query
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const result = await getReviews(storeId, query)

  return reply.code(200).send(result)
}

// Get product reviews handler
export const getProductReviewsHandler: RouteHandler<{
  Params: { productId: string }
  Querystring: Omit<ReviewListQuery, 'productId'>
}> = async (req, reply) => {
  const { productId } = req.params
  const query = req.query
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const result = await getProductReviews(productId, storeId, query)

  return reply.code(200).send(result)
}

// Get store reviews handler
export const getStoreReviewsHandler: RouteHandler<{
  Querystring: Omit<ReviewListQuery, 'productId'>
}> = async (req, reply) => {
  const query = req.query
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const result = await getStoreReviews(storeId, query)

  return reply.code(200).send(result)
}

// Get product review stats handler
export const getProductReviewStatsHandler: RouteHandler<{
  Params: { productId: string }
}> = async (req, reply) => {
  const { productId } = req.params
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const stats = await getProductReviewStats(productId, storeId)

  return reply.code(200).send({ stats })
}

// Get store review stats handler
export const getStoreReviewStatsHandler: RouteHandler = async (req, reply) => {
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const stats = await getStoreReviewStats(storeId)

  return reply.code(200).send({ stats })
}
