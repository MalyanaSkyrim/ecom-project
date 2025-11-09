import { FastifyPluginAsync } from 'fastify'

import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
} from './category.controller'
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategoriesSchema,
  getCategorySchema,
  updateCategorySchema,
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
