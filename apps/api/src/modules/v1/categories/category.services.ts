import { db } from '@ecom/database'

import type {
  Category,
  CategoryListQuery,
  CreateCategoryInput,
  UpdateCategoryInput,
} from './category.schema'

// Helper function to calculate pagination metadata
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
  const { searchText, parentId, isActive } = query

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

  if (parentId !== undefined) {
    where.parentId = parentId || null
  }

  if (isActive !== undefined) {
    where.isActive = isActive
  }

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

  return db.category.findMany({
    where,
    orderBy: [{ parentId: 'asc' }, { name: 'asc' }],
  })
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
