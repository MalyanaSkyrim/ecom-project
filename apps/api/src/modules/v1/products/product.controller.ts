import { RouteHandler } from 'fastify'

import type {
  CreateProductInput,
  ProductListQuery,
  ProductParams,
  UpdateProductInput,
} from './product.schema'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  isProductSlugUnique,
  updateProduct,
} from './product.services'

// Create product handler
export const createProductHandler: RouteHandler<{
  Body: CreateProductInput
}> = async (req, reply) => {
  try {
    const data = req.body
    const storeId = req.user?.storeId

    if (!storeId) {
      return reply.code(400).send({ message: 'Store ID is required' })
    }

    // Check if slug is unique
    const isSlugUnique = await isProductSlugUnique(data.slug, storeId)
    if (!isSlugUnique) {
      return reply.code(400).send({ message: 'Product slug must be unique' })
    }

    const product = await createProduct(storeId, data)

    return reply.code(201).send({ product })
  } catch (error) {
    req.log.error(error, 'Error creating product')
    return reply.code(500).send({ message: 'Internal server error' })
  }
}

// Get product by ID handler
export const getProductHandler: RouteHandler<{
  Params: ProductParams
}> = async (req, reply) => {
  try {
    const { id } = req.params
    const storeId = req.user?.storeId

    if (!storeId) {
      return reply.code(400).send({ message: 'Store ID is required' })
    }

    const product = await getProductById(id, storeId)

    if (!product) {
      return reply.code(404).send({ message: 'Product not found' })
    }

    return reply.code(200).send({ product })
  } catch (error) {
    req.log.error(error, 'Error getting product')
    return reply.code(500).send({ message: 'Internal server error' })
  }
}

// Update product handler
export const updateProductHandler: RouteHandler<{
  Params: ProductParams
  Body: UpdateProductInput
}> = async (req, reply) => {
  try {
    const { id } = req.params
    const data = req.body
    const storeId = req.user?.storeId

    if (!storeId) {
      return reply.code(400).send({ message: 'Store ID is required' })
    }

    // Check if slug is unique (if slug is being updated)
    if (data.slug) {
      const isSlugUnique = await isProductSlugUnique(data.slug, storeId, id)
      if (!isSlugUnique) {
        return reply.code(400).send({ message: 'Product slug must be unique' })
      }
    }

    const product = await updateProduct(id, storeId, data)

    if (!product) {
      return reply.code(404).send({ message: 'Product not found' })
    }

    return reply.code(200).send({ product })
  } catch (error) {
    req.log.error(error, 'Error updating product')
    return reply.code(500).send({ message: 'Internal server error' })
  }
}

// Delete product handler
export const deleteProductHandler: RouteHandler<{
  Params: ProductParams
}> = async (req, reply) => {
  try {
    const { id } = req.params
    const storeId = req.user?.storeId

    if (!storeId) {
      return reply.code(400).send({ message: 'Store ID is required' })
    }

    const deleted = await deleteProduct(id, storeId)

    if (!deleted) {
      return reply.code(404).send({ message: 'Product not found' })
    }

    return reply.code(204).send(null)
  } catch (error) {
    req.log.error(error, 'Error deleting product')
    return reply.code(500).send({ message: 'Internal server error' })
  }
}

// Get products list handler
export const getProductsHandler: RouteHandler<{
  Querystring: ProductListQuery
}> = async (req, reply) => {
  try {
    const query = req.query
    const storeId = req.user?.storeId

    if (!storeId) {
      return reply.code(400).send({ message: 'Store ID is required' })
    }

    const result = await getProducts(storeId, query)

    return reply.code(200).send(result)
  } catch (error) {
    req.log.error(error, 'Error getting products')
    return reply.code(500).send({ message: 'Internal server error' })
  }
}
