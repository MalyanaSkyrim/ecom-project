import { db } from '@ecom/database'

import type {
  CreateProductInput,
  Product,
  ProductListQuery,
  UpdateProductInput,
} from './product.schema'

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

// Create a new product
export const createProduct = async (
  storeId: string,
  data: CreateProductInput,
): Promise<Product> => {
  const product = await db.product.create({
    data: {
      ...data,
      storeId,
    },
  })

  return {
    ...product,
    price: Number(product.price),
    rating: product.rating ? Number(product.rating) : null,
  }
}

// Get a product by ID
export const getProductById = async (
  id: string,
  storeId: string,
): Promise<Product | null> => {
  const product = await db.product.findFirst({
    where: {
      id,
      storeId,
    },
  })

  if (!product) {
    return null
  }

  return {
    ...product,
    price: Number(product.price),
    rating: product.rating ? Number(product.rating) : null,
  }
}

// Update a product
export const updateProduct = async (
  id: string,
  storeId: string,
  data: UpdateProductInput,
): Promise<Product | null> => {
  // Check if product exists and belongs to the store
  const existingProduct = await db.product.findFirst({
    where: {
      id,
      storeId,
    },
  })

  if (!existingProduct) {
    return null
  }

  const product = await db.product.update({
    where: { id },
    data,
  })

  return {
    ...product,
    price: Number(product.price),
    rating: product.rating ? Number(product.rating) : null,
  }
}

// Delete a product
export const deleteProduct = async (
  id: string,
  storeId: string,
): Promise<boolean> => {
  // Check if product exists and belongs to the store
  const existingProduct = await db.product.findFirst({
    where: {
      id,
      storeId,
    },
  })

  if (!existingProduct) {
    return false
  }

  await db.product.delete({
    where: { id },
  })

  return true
}

// Get paginated list of products
export const getProducts = async (storeId: string, query: ProductListQuery) => {
  const { pageSize, pageIndex, isFeatured, searchText } = query

  // Build where clause
  const where: any = {
    storeId,
  }

  // Add featured filter if provided
  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured
  }

  // Add search filter if provided
  if (searchText) {
    where.OR = [
      {
        name: {
          contains: searchText,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: searchText,
          mode: 'insensitive',
        },
      },
    ]
  }

  // Get total count for pagination
  const totalCount = await db.product.count({ where })

  // Get products with pagination
  const products = await db.product.findMany({
    where,
    skip: pageIndex * pageSize,
    take: pageSize,
    orderBy: [
      { isFeatured: 'desc' }, // Featured products first
      { createdAt: 'desc' }, // Then by creation date
    ],
  })

  // Transform products to include proper number types
  const transformedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    rating: product.rating ? Number(product.rating) : null,
  }))

  return {
    data: transformedProducts,
    pagination: calculatePaginationMeta(totalCount, pageSize, pageIndex),
  }
}

// Check if product slug is unique within a store
export const isProductSlugUnique = async (
  slug: string,
  storeId: string,
  excludeId?: string,
): Promise<boolean> => {
  const where: any = {
    slug,
    storeId,
  }

  // Exclude current product when updating
  if (excludeId) {
    where.id = {
      not: excludeId,
    }
  }

  const existingProduct = await db.product.findFirst({ where })
  return !existingProduct
}
