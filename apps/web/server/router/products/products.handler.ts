import { env } from '@/env'

import type {
  PaginationReply,
  ProductListQuery,
  ProductResponse,
} from '@ecom/common'
import { ApiClient } from '@ecom/http-client'

import {
  SORT_OPTION_IDS,
  type ProductFiltersInput,
  type SortOptionId,
} from './products.schema'

// Create API client instance
const apiClient = new ApiClient(env.API_URL, env.API_KEY)

const SORTING_MAP: Record<
  SortOptionId,
  NonNullable<ProductListQuery['sorting']>
> = {
  'Most Popular': [
    { id: 'totalSales', direction: 'desc' },
    { id: 'createdAt', direction: 'desc' },
  ],
  'Price Low-High': [{ id: 'price', direction: 'asc' }],
  'Price High-Low': [{ id: 'price', direction: 'desc' }],
  Rating: [{ id: 'rating', direction: 'desc' }],
  Newest: [{ id: 'createdAt', direction: 'desc' }],
}

const DEFAULT_SORT: SortOptionId = SORT_OPTION_IDS[0]!

const normalizeFilters = (input: ProductFiltersInput): ProductListQuery => {
  const pageIndex = Math.max(0, input.page - 1)

  const query: ProductListQuery = {
    pageSize: input.pageSize,
    pageIndex,
  }

  if (input.categoryId) {
    query.categoryId = input.categoryId
  }

  if (input.priceMin !== undefined) {
    query.priceMin = input.priceMin
  }
  if (input.priceMax !== undefined) {
    query.priceMax = input.priceMax
  }

  if (input.colors && input.colors.length > 0) {
    query.colors = input.colors
  }

  if (input.sizes && input.sizes.length > 0) {
    query.sizes = input.sizes
  }

  const sortOption = input.sort ?? DEFAULT_SORT
  query.sorting = SORTING_MAP[sortOption]

  return query
}

const unwrapErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as {
      response?: { body?: { message?: string } }
    }
    if (responseError?.response?.body?.message) {
      return new Error(responseError.response.body.message)
    }
  }
  return error instanceof Error ? error : new Error('Unknown error')
}

export const getNewArrivals = async (): Promise<ProductResponse[]> => {
  try {
    const result = (await apiClient.getProducts({
      pageSize: 4,
      pageIndex: 0,
      sorting: SORTING_MAP.Newest,
    })) as PaginationReply<ProductResponse>

    return result.data
  } catch (error: unknown) {
    throw unwrapErrorMessage(error)
  }
}

export const getTopSelling = async (): Promise<ProductResponse[]> => {
  try {
    const result = (await apiClient.getProducts({
      pageSize: 4,
      pageIndex: 0,
      sorting: SORTING_MAP['Most Popular'],
    })) as PaginationReply<ProductResponse>

    return result.data
  } catch (error: unknown) {
    throw unwrapErrorMessage(error)
  }
}

export const getAllProducts = async (
  filters: ProductFiltersInput,
): Promise<PaginationReply<ProductResponse>> => {
  try {
    const query = normalizeFilters(filters)
    const result = await apiClient.getProducts(query)
    return result
  } catch (error: unknown) {
    throw unwrapErrorMessage(error)
  }
}
