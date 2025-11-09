import { z } from 'zod'

import { paginationReplySchema, productResponseSchema } from '@ecom/common'

export const SORT_OPTION_IDS = [
  'Most Popular',
  'Price Low-High',
  'Price High-Low',
  'Rating',
  'Newest',
] as const

export const productFiltersInputSchema = z
  .object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(60).default(12),
    categoryId: z.string().optional(),
    priceMin: z.number().min(0).optional(),
    priceMax: z.number().min(0).optional(),
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    sort: z.enum(SORT_OPTION_IDS).optional(),
  })
  .transform((value) => {
    const unique = <T extends string>(items?: T[]) =>
      items
        ? Array.from(new Set(items.filter((item) => item.trim().length > 0)))
        : undefined

    const { priceMin, priceMax } = value
    let min = priceMin
    let max = priceMax

    if (min !== undefined) {
      min = Math.max(0, min)
    }
    if (max !== undefined) {
      max = Math.max(0, max)
    }
    if (min !== undefined && max !== undefined && min > max) {
      ;[min, max] = [max, min]
    }

    return {
      ...value,
      priceMin: min,
      priceMax: max,
      colors: unique(value.colors),
      sizes: unique(value.sizes),
    }
  })

export const productListResponseSchema = paginationReplySchema(
  productResponseSchema,
)

export const newArrivalsInputSchema = z.object({})

export type NewArrivalsInput = z.infer<typeof newArrivalsInputSchema>
export type ProductFiltersInput = z.infer<typeof productFiltersInputSchema>
export type SortOptionId = (typeof SORT_OPTION_IDS)[number]
