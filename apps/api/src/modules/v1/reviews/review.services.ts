import { db } from '@ecom/database'

import type {
  CreateReviewInput,
  Review,
  ReviewListQuery,
  UpdateReviewInput,
} from './review.schema'

// Helper function to calculate pagination metadata
export const calculatePaginationMeta = (
  totalCount: number,
  pageSize: number,
  pageIndex: number,
) => {
  const totalPages = Math.ceil(totalCount / pageSize)
  return {
    totalCount,
    pageSize,
    pageIndex,
    totalPages,
    hasNextPage: pageIndex < totalPages - 1,
    hasPreviousPage: pageIndex > 0,
  }
}

// Create a new review
export const createReview = async (
  storeId: string,
  data: CreateReviewInput,
): Promise<Review> => {
  const review = await db.review.create({
    data: {
      ...data,
      storeId,
    },
  })

  return {
    ...review,
    rating: Number(review.rating),
  }
}

// Get a review by ID
export const getReviewById = async (
  id: string,
  storeId: string,
): Promise<Review | null> => {
  const review = await db.review.findFirst({
    where: {
      id,
      storeId,
    },
  })

  if (!review) {
    return null
  }

  return {
    ...review,
    rating: Number(review.rating),
  }
}

// Update a review
export const updateReview = async (
  id: string,
  storeId: string,
  data: UpdateReviewInput,
): Promise<Review | null> => {
  // Check if review exists and belongs to the store
  const existingReview = await db.review.findFirst({
    where: {
      id,
      storeId,
    },
  })

  if (!existingReview) {
    return null
  }

  const review = await db.review.update({
    where: { id },
    data,
  })

  return {
    ...review,
    rating: Number(review.rating),
  }
}

// Delete a review
export const deleteReview = async (
  id: string,
  storeId: string,
): Promise<boolean> => {
  // Check if review exists and belongs to the store
  const existingReview = await db.review.findFirst({
    where: {
      id,
      storeId,
    },
  })

  if (!existingReview) {
    return false
  }

  await db.review.delete({
    where: { id },
  })

  return true
}

// Get paginated list of reviews
export const getReviews = async (storeId: string, query: ReviewListQuery) => {
  const { pageSize, pageIndex, productId, customerId, rating, sorting } = query

  // Build where clause
  const where: {
    storeId: string
    productId?: string | null
    customerId?: string
    rating?: number
  } = {
    storeId,
  }

  // Add product filter if provided
  if (productId !== undefined) {
    where.productId = productId || null
  }

  // Add customer filter if provided
  if (customerId) {
    where.customerId = customerId
  }

  // Add rating filter if provided
  if (rating) {
    where.rating = rating
  }

  // Build orderBy clause
  let orderBy: Array<Record<string, 'asc' | 'desc'>> = []

  if (sorting && sorting.length > 0) {
    // Convert sorting array to Prisma orderBy format
    orderBy = sorting.map((sort) => ({
      [sort.id]: sort.direction,
    }))
  } else {
    // Default sorting: newest first
    orderBy = [{ createdAt: 'desc' }]
  }

  // Get total count for pagination
  const totalCount = await db.review.count({ where })

  // Get reviews with pagination
  const reviews = await db.review.findMany({
    where,
    skip: pageIndex * pageSize,
    take: pageSize,
    orderBy,
  })

  // Transform reviews to include proper number types
  const transformedReviews = reviews.map((review) => ({
    ...review,
    rating: Number(review.rating),
  }))

  return {
    data: transformedReviews,
    pagination: calculatePaginationMeta(totalCount, pageSize, pageIndex),
  }
}

// Get reviews for a specific product
export const getProductReviews = async (
  productId: string,
  storeId: string,
  query: Omit<ReviewListQuery, 'productId'>,
) => {
  return getReviews(storeId, { ...query, productId })
}

// Get store reviews (reviews without productId)
export const getStoreReviews = async (
  storeId: string,
  query: Omit<ReviewListQuery, 'productId'>,
) => {
  return getReviews(storeId, { ...query, productId: undefined })
}

// Get review statistics for a product
export const getProductReviewStats = async (
  productId: string,
  storeId: string,
) => {
  const stats = await db.review.aggregate({
    where: {
      productId,
      storeId,
    },
    _count: {
      id: true,
    },
    _avg: {
      rating: true,
    },
    _min: {
      rating: true,
    },
    _max: {
      rating: true,
    },
  })

  return {
    totalReviews: stats._count.id,
    averageRating: stats._avg.rating ? Number(stats._avg.rating) : null,
    minRating: stats._min.rating ? Number(stats._min.rating) : null,
    maxRating: stats._max.rating ? Number(stats._max.rating) : null,
  }
}

// Get review statistics for a store
export const getStoreReviewStats = async (storeId: string) => {
  const stats = await db.review.aggregate({
    where: {
      storeId,
    },
    _count: {
      id: true,
    },
    _avg: {
      rating: true,
    },
    _min: {
      rating: true,
    },
    _max: {
      rating: true,
    },
  })

  return {
    totalReviews: stats._count.id,
    averageRating: stats._avg.rating ? Number(stats._avg.rating) : null,
    minRating: stats._min.rating ? Number(stats._min.rating) : null,
    maxRating: stats._max.rating ? Number(stats._max.rating) : null,
  }
}
