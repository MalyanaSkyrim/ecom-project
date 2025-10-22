import { env } from '@/env'

import { ApiClient } from '@ecom/http-client'

import type {
  CategoriesListResponse,
  CategoriesQuery,
} from './categories.schema'

// Create API client instance
const apiClient = new ApiClient(env.API_URL, env.API_KEY)

export const getCategories = async (
  query: CategoriesQuery,
): Promise<CategoriesListResponse> => {
  try {
    const result = await apiClient.getCategories(query)
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
