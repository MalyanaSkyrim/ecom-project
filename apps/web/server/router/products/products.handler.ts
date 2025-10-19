import { env } from '@/env'

import type { PaginationReply, ProductResponse } from '@ecom/common'
import { ApiClient } from '@ecom/http-client'

console.log('##########@ env.API_URL', env.API_URL)

// Create API client instance
const apiClient = new ApiClient(env.API_URL, env.API_KEY)

export const getNewArrivals = async (): Promise<ProductResponse[]> => {
  try {
    // Get first 4 products ordered by createdAt (API already orders by createdAt desc)
    const result = (await apiClient.getProducts({
      pageSize: 4,
      pageIndex: 0,
    })) as PaginationReply<ProductResponse>

    // Return the data array which contains ProductResponse[]
    return result.data
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

export const getTopSelling = async (): Promise<ProductResponse[]> => {
  try {
    // Get first 4 products ordered by totalSales desc
    const result = (await apiClient.getProducts({
      pageSize: 4,
      pageIndex: 0,
      sorting: [{ id: 'totalSales', direction: 'desc' }],
    })) as PaginationReply<ProductResponse>

    // Return the data array which contains ProductResponse[]
    return result.data
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
