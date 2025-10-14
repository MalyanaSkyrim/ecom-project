import { RouteHandler } from 'fastify'

import {
  InvalidProductDataError,
  ProductCreationFailedError,
  ProductDeletionFailedError,
  ProductNotFoundError,
  ProductUpdateFailedError,
  StoreIdRequiredError,
} from '../../../lib/error'
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
  const data = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  // Check if slug is unique
  const isSlugUnique = await isProductSlugUnique(data.slug, storeId)
  if (!isSlugUnique) {
    throw new InvalidProductDataError({
      message: `Product slug '${data.slug}' is already taken. Please choose a different slug.`,
      meta: { slug: data.slug, storeId },
    })
  }

  try {
    const product = await createProduct(storeId, data)
    return reply.code(201).send({ product })
  } catch (error) {
    throw new ProductCreationFailedError({
      message:
        'Failed to create product. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        storeId,
        productData: { name: data.name, slug: data.slug },
      },
    })
  }
}

// Get product by ID handler
export const getProductHandler: RouteHandler<{
  Params: ProductParams
}> = async (req, reply) => {
  const { id } = req.params
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const product = await getProductById(id, storeId)

  if (!product) {
    throw new ProductNotFoundError({
      message: `Product with ID '${id}' not found in your store.`,
      meta: { productId: id, storeId },
    })
  }

  return reply.code(200).send({ product })
}

// Update product handler
export const updateProductHandler: RouteHandler<{
  Params: ProductParams
  Body: UpdateProductInput
}> = async (req, reply) => {
  const { id } = req.params
  const data = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  // Check if slug is unique (if slug is being updated)
  if (data.slug) {
    const isSlugUnique = await isProductSlugUnique(data.slug, storeId, id)
    if (!isSlugUnique) {
      throw new InvalidProductDataError({
        message: `Product slug '${data.slug}' is already taken. Please choose a different slug.`,
        meta: { slug: data.slug, storeId, productId: id },
      })
    }
  }

  try {
    const product = await updateProduct(id, storeId, data)

    if (!product) {
      throw new ProductNotFoundError({
        message: `Product with ID '${id}' not found in your store.`,
        meta: { productId: id, storeId },
      })
    }

    return reply.code(200).send({ product })
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      throw error
    }
    throw new ProductUpdateFailedError({
      message:
        'Failed to update product. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        productId: id,
        storeId,
        updateData: data,
      },
    })
  }
}

// Delete product handler
export const deleteProductHandler: RouteHandler<{
  Params: ProductParams
}> = async (req, reply) => {
  const { id } = req.params
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  try {
    const deleted = await deleteProduct(id, storeId)

    if (!deleted) {
      throw new ProductNotFoundError({
        message: `Product with ID '${id}' not found in your store.`,
        meta: { productId: id, storeId },
      })
    }

    return reply.code(204).send(null)
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      throw error
    }
    throw new ProductDeletionFailedError({
      message:
        'Failed to delete product. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        productId: id,
        storeId,
      },
    })
  }
}

// Get products list handler
export const getProductsHandler: RouteHandler<{
  Querystring: ProductListQuery
}> = async (req, reply) => {
  const query = req.query
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const result = await getProducts(storeId, query)

  return reply.code(200).send(result)
}
