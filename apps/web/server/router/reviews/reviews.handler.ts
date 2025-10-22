import { env } from '@/env'

import { ApiClient } from '@ecom/http-client'

import type { ReviewsListResponse, StoreReviewsQuery } from './reviews.schema'

// Create API client instance
const apiClient = new ApiClient(env.API_URL, env.API_KEY)

export const getStoreReviews = async (
  query: StoreReviewsQuery,
): Promise<ReviewsListResponse> => {
  try {
    const result = await apiClient.getStoreReviews(query)
    return result
  } catch (error: unknown) {
    console.log('##########@ error', error)
    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error as {
        response?: { body?: { message?: string } }
      }
      if (responseError?.response?.body?.message) {
        throw new Error(responseError.response.body.message)
      }
    }
    throw error
  }
}
