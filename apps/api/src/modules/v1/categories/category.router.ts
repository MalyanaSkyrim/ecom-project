import { FastifyPluginAsync } from 'fastify'

import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  getCategoryHandler,
  getCategoryHierarchyHandler,
  updateCategoryHandler,
} from './category.controller'
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategoriesSchema,
  getCategorySchema,
  updateCategorySchema,
  categoryRef,
} from './category.schema'

/**
 * Category routes plugin
 * Provides CRUD operations for categories with pagination and search
 */
const categoryRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // GET /categories - List categories with pagination and filtering
  fastify.get(
    '/',
    {
      schema: getCategoriesSchema,
    },
    getCategoriesHandler,
  )

  // GET /categories/hierarchy - Get category hierarchy
  fastify.get(
    '/hierarchy',
    {
      schema: {
        tags: ['Categories'],
        description: 'Get category hierarchy',
        security: [{ apiKey: [] }],
        summary: 'Get category hierarchy',
        operationId: 'getCategoryHierarchy',
        response: {
          '200': {
            type: 'object',
            properties: {
              categories: {
                type: 'array',
                items: categoryRef('categoryResponseSchema'),
              },
            },
          },
          '500': categoryRef('errorReplySchema'),
        },
      },
    },
    getCategoryHierarchyHandler,
  )

  // POST /categories - Create a new category
  fastify.post(
    '/',
    {
      schema: createCategorySchema,
    },
    createCategoryHandler,
  )

  // GET /categories/:id - Get a single category by ID
  fastify.get(
    '/:id',
    {
      schema: getCategorySchema,
    },
    getCategoryHandler,
  )

  // PUT /categories/:id - Update a category by ID
  fastify.put(
    '/:id',
    {
      schema: updateCategorySchema,
    },
    updateCategoryHandler,
  )

  // DELETE /categories/:id - Delete a category by ID
  fastify.delete(
    '/:id',
    {
      schema: deleteCategorySchema,
    },
    deleteCategoryHandler,
  )
}

export default categoryRoutes
