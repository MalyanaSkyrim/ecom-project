import { db } from '@ecom/database'

import type {
  Category,
  CategoryListQuery,
  CreateCategoryInput,
  UpdateCategoryInput,
} from './category.schema'

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

// Create a new category
export const createCategory = async (
  storeId: string,
  data: CreateCategoryInput,
): Promise<Category> => {
  const category = await db.category.create({
    data: {
      ...data,
      storeId,
    },
  })

  return category
}

// Get a category by ID
export const getCategoryById = async (
  id: string,
  storeId: string,
): Promise<Category | null> => {
  const category = await db.category.findFirst({
    where: {
      id,
      storeId,
    },
  })

  if (!category) {
    return null
  }

  return category
}

// Update a category
export const updateCategory = async (
  id: string,
  storeId: string,
  data: UpdateCategoryInput,
): Promise<Category | null> => {
  // Check if category exists and belongs to the store
  const existingCategory = await db.category.findFirst({
    where: {
      id,
      storeId,
    },
  })

  if (!existingCategory) {
    return null
  }

  const category = await db.category.update({
    where: { id },
    data,
  })

  return category
}

// Delete a category
export const deleteCategory = async (
  id: string,
  storeId: string,
): Promise<boolean> => {
  // Check if category exists and belongs to the store
  const existingCategory = await db.category.findFirst({
    where: {
      id,
      storeId,
    },
  })

  if (!existingCategory) {
    return false
  }

  await db.category.delete({
    where: { id },
  })

  return true
}

// Get paginated list of categories
export const getCategories = async (
  storeId: string,
  query: CategoryListQuery,
) => {
  const { pageSize, pageIndex, searchText, parentId, isActive, sorting } = query

  // Build where clause
  const where: {
    storeId: string
    parentId?: string | null
    isActive?: boolean
    OR?: Array<{
      name?: { contains: string; mode: 'insensitive' }
      description?: { contains: string; mode: 'insensitive' }
    }>
  } = {
    storeId,
  }

  // Add parent filter if provided
  if (parentId !== undefined) {
    where.parentId = parentId || null
  }

  // Add active filter if provided
  if (isActive !== undefined) {
    where.isActive = isActive
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

  // Build orderBy clause
  let orderBy: Array<Record<string, 'asc' | 'desc'>> = []

  if (sorting && sorting.length > 0) {
    // Convert sorting array to Prisma orderBy format
    orderBy = sorting.map((sort) => ({
      [sort.id]: sort.direction,
    }))
  } else {
    // Default sorting: parent categories first, then by name
    orderBy = [{ parentId: 'asc' }, { name: 'asc' }]
  }

  // Get total count for pagination
  const totalCount = await db.category.count({ where })

  // Get categories with pagination
  const categories = await db.category.findMany({
    where,
    skip: pageIndex * pageSize,
    take: pageSize,
    orderBy,
  })

  return {
    data: categories,
    pagination: calculatePaginationMeta(totalCount, pageSize, pageIndex),
  }
}

// Check if category slug is unique within a store
export const isCategorySlugUnique = async (
  slug: string,
  storeId: string,
  excludeId?: string,
): Promise<boolean> => {
  const where: {
    slug: string
    storeId: string
    id?: { not: string }
  } = {
    slug,
    storeId,
  }

  // Exclude current category when updating
  if (excludeId) {
    where.id = {
      not: excludeId,
    }
  }

  const existingCategory = await db.category.findFirst({ where })
  return !existingCategory
}

// Get category hierarchy (parent categories and their children)
export const getCategoryHierarchy = async (storeId: string) => {
  const categories = await db.category.findMany({
    where: {
      storeId,
      isActive: true,
    },
    orderBy: [{ parentId: 'asc' }, { name: 'asc' }],
  })

  return categories
}
