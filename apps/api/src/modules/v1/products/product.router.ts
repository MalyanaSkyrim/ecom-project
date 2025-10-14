import { FastifyPluginAsync } from 'fastify'

import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  getProductsHandler,
  updateProductHandler,
} from './product.controller'
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  getProductsSchema,
  updateProductSchema,
} from './product.schema'

/**
 * Product routes plugin
 * Provides CRUD operations for products with pagination and search
 */
const productRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // GET /products - List products with pagination and filtering
  fastify.get(
    '/',
    {
      schema: getProductsSchema,
    },
    getProductsHandler,
  )

  // POST /products - Create a new product
  fastify.post(
    '/',
    {
      schema: createProductSchema,
    },
    createProductHandler,
  )

  // GET /products/:id - Get a single product by ID
  fastify.get(
    '/:id',
    {
      schema: getProductSchema,
    },
    getProductHandler,
  )

  // PUT /products/:id - Update a product by ID
  fastify.put(
    '/:id',
    {
      schema: updateProductSchema,
    },
    updateProductHandler,
  )

  // DELETE /products/:id - Delete a product by ID
  fastify.delete(
    '/:id',
    {
      schema: deleteProductSchema,
    },
    deleteProductHandler,
  )
}

export default productRoutes
