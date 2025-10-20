import { RouteHandler } from 'fastify'

import {
  CategoryCreationFailedError,
  CategoryDeletionFailedError,
  CategoryNotFoundError,
  CategoryUpdateFailedError,
  InvalidCategoryDataError,
  StoreIdRequiredError,
} from '../../../lib/error'
import type {
  CategoryListQuery,
  CategoryParams,
  CreateCategoryInput,
  UpdateCategoryInput,
} from './category.schema'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryHierarchy,
  isCategorySlugUnique,
  updateCategory,
} from './category.services'

// Create category handler
export const createCategoryHandler: RouteHandler<{
  Body: CreateCategoryInput
}> = async (req, reply) => {
  const data = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  // Check if slug is unique
  const isSlugUnique = await isCategorySlugUnique(data.slug, storeId)
  if (!isSlugUnique) {
    throw new InvalidCategoryDataError({
      message: `Category slug '${data.slug}' is already taken. Please choose a different slug.`,
      meta: { slug: data.slug, storeId },
    })
  }

  // Validate parent category exists if provided
  if (data.parentId) {
    const parentCategory = await getCategoryById(data.parentId, storeId)
    if (!parentCategory) {
      throw new InvalidCategoryDataError({
        message: `Parent category with ID '${data.parentId}' not found.`,
        meta: { parentId: data.parentId, storeId },
      })
    }
  }

  try {
    const category = await createCategory(storeId, data)
    return reply.code(201).send({ category })
  } catch (error) {
    throw new CategoryCreationFailedError({
      message:
        'Failed to create category. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        storeId,
        categoryData: { name: data.name, slug: data.slug },
      },
    })
  }
}

// Get category by ID handler
export const getCategoryHandler: RouteHandler<{
  Params: CategoryParams
}> = async (req, reply) => {
  const { id } = req.params
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const category = await getCategoryById(id, storeId)

  if (!category) {
    throw new CategoryNotFoundError({
      message: `Category with ID '${id}' not found in your store.`,
      meta: { categoryId: id, storeId },
    })
  }

  return reply.code(200).send({ category })
}

// Update category handler
export const updateCategoryHandler: RouteHandler<{
  Params: CategoryParams
  Body: UpdateCategoryInput
}> = async (req, reply) => {
  const { id } = req.params
  const data = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  // Check if slug is unique (if slug is being updated)
  if (data.slug) {
    const isSlugUnique = await isCategorySlugUnique(data.slug, storeId, id)
    if (!isSlugUnique) {
      throw new InvalidCategoryDataError({
        message: `Category slug '${data.slug}' is already taken. Please choose a different slug.`,
        meta: { slug: data.slug, storeId, categoryId: id },
      })
    }
  }

  // Validate parent category exists if provided
  if (data.parentId) {
    const parentCategory = await getCategoryById(data.parentId, storeId)
    if (!parentCategory) {
      throw new InvalidCategoryDataError({
        message: `Parent category with ID '${data.parentId}' not found.`,
        meta: { parentId: data.parentId, storeId, categoryId: id },
      })
    }
  }

  try {
    const category = await updateCategory(id, storeId, data)

    if (!category) {
      throw new CategoryNotFoundError({
        message: `Category with ID '${id}' not found in your store.`,
        meta: { categoryId: id, storeId },
      })
    }

    return reply.code(200).send({ category })
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      throw error
    }
    throw new CategoryUpdateFailedError({
      message:
        'Failed to update category. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        categoryId: id,
        storeId,
        updateData: data,
      },
    })
  }
}

// Delete category handler
export const deleteCategoryHandler: RouteHandler<{
  Params: CategoryParams
}> = async (req, reply) => {
  const { id } = req.params
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  try {
    const deleted = await deleteCategory(id, storeId)

    if (!deleted) {
      throw new CategoryNotFoundError({
        message: `Category with ID '${id}' not found in your store.`,
        meta: { categoryId: id, storeId },
      })
    }

    return reply.code(204).send(null)
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      throw error
    }
    throw new CategoryDeletionFailedError({
      message:
        'Failed to delete category. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        categoryId: id,
        storeId,
      },
    })
  }
}

// Get categories list handler
export const getCategoriesHandler: RouteHandler<{
  Querystring: CategoryListQuery
}> = async (req, reply) => {
  const query = req.query
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const result = await getCategories(storeId, query)

  return reply.code(200).send(result)
}

// Get category hierarchy handler
export const getCategoryHierarchyHandler: RouteHandler = async (req, reply) => {
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const categories = await getCategoryHierarchy(storeId)

  return reply.code(200).send({ categories })
}
