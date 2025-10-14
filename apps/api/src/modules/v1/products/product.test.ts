import { createHash, randomBytes } from 'crypto'

import { db } from '@ecom/database'

import { build } from '../../../utils/vitestHelper'

describe('Product API tests', () => {
  const app = build()
  let storeId: string
  let apiKey: string
  let createdProductId: string

  // Setup: Create store and API key before tests
  beforeAll(async () => {
    // Create a test store
    const store = await db.store.create({
      data: {
        name: 'Test Store',
        slug: `test-store-${Date.now()}`,
        isActive: true,
      },
    })
    storeId = store.id

    // Generate and create an API key
    const secret = randomBytes(32).toString('hex')
    const plainApiKey = `sk_live_${secret}`
    const hashedKey = createHash('sha256').update(plainApiKey).digest('hex')
    const keyPrefix = plainApiKey.substring(0, 16)

    await db.apiKey.create({
      data: {
        storeId: store.id,
        name: 'Test API Key',
        keyPrefix,
        hashedKey,
        isActive: true,
      },
    })

    apiKey = plainApiKey
  })

  // Cleanup: Delete test data after all tests
  afterAll(async () => {
    await db.product.deleteMany({ where: { storeId } })
    await db.apiKey.deleteMany({ where: { storeId } })
    await db.store.delete({ where: { id: storeId } })
    await db.$disconnect()
  })

  const mockProduct = {
    name: 'Test Product',
    slug: 'test-product',
    description: 'A test product description',
    price: 99.99,
    isActive: true,
    isFeatured: false,
  }

  describe('POST /products', () => {
    test('should create a new product', async () => {
      const res = await app.inject({
        url: '/v1/products',
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
        body: mockProduct,
      })

      const response = res.json()
      expect(res.statusCode).toEqual(201)
      expect(response).toHaveProperty('product')
      expect(response.product).toHaveProperty('id')
      expect(response.product.name).toEqual(mockProduct.name)
      expect(response.product.slug).toEqual(mockProduct.slug)
      expect(response.product.price).toEqual(mockProduct.price)
      expect(response.product.isActive).toEqual(mockProduct.isActive)
      expect(response.product.isFeatured).toEqual(mockProduct.isFeatured)

      // Save the created product ID for later tests
      createdProductId = response.product.id
    })

    test('should return 400 for invalid product data', async () => {
      const invalidProduct = {
        name: '', // Invalid: empty name
        price: -10, // Invalid: negative price
      }

      const res = await app.inject({
        url: '/v1/products',
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
        body: invalidProduct,
      })

      expect(res.statusCode).toEqual(400)
      const response = res.json()
      expect(response).toHaveProperty('message')
    })

    test('should return 401 without authentication', async () => {
      const res = await app.inject({
        url: '/v1/products',
        method: 'POST',
        body: mockProduct,
      })

      expect(res.statusCode).toEqual(401)
    })
  })

  describe('GET /products', () => {
    test('should get products list with default pagination', async () => {
      const res = await app.inject({
        url: '/v1/products',
        method: 'GET',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(200)
      const response = res.json()
      expect(response).toHaveProperty('data')
      expect(response).toHaveProperty('pagination')
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.pagination).toHaveProperty('pageSize')
      expect(response.pagination).toHaveProperty('pageIndex')
      expect(response.pagination).toHaveProperty('total')
    })

    test('should get products with pagination parameters', async () => {
      const res = await app.inject({
        url: '/v1/products?pageSize=5&pageIndex=0',
        method: 'GET',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(200)
      const response = res.json()
      expect(response.pagination.pageSize).toEqual(5)
      expect(response.pagination.pageIndex).toEqual(0)
    })

    test('should filter products by featured status', async () => {
      const res = await app.inject({
        url: '/v1/products?isFeatured=true',
        method: 'GET',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(200)
      const response = res.json()
      expect(Array.isArray(response.data)).toBe(true)
    })

    test('should search products by text', async () => {
      const res = await app.inject({
        url: '/v1/products?searchText=test',
        method: 'GET',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(200)
      const response = res.json()
      expect(Array.isArray(response.data)).toBe(true)
    })
  })

  describe('GET /products/:id', () => {
    test('should get a product by ID', async () => {
      const res = await app.inject({
        url: `/v1/products/${createdProductId}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(200)
      const response = res.json()
      expect(response).toHaveProperty('product')
      expect(response.product.id).toEqual(createdProductId)
      expect(response.product).toHaveProperty('name')
      expect(response.product).toHaveProperty('slug')
      expect(response.product).toHaveProperty('price')
    })

    test('should return 404 for non-existent product', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'
      const res = await app.inject({
        url: `/v1/products/${nonExistentId}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(404)
      const response = res.json()
      expect(response.message).toEqual('Product not found')
    })
  })

  describe('PUT /products/:id', () => {
    test('should update a product', async () => {
      const updateData = {
        name: 'Updated Product Name',
        price: 149.99,
      }

      const res = await app.inject({
        url: `/v1/products/${createdProductId}`,
        method: 'PUT',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
        body: updateData,
      })

      expect(res.statusCode).toEqual(200)
      const response = res.json()
      expect(response).toHaveProperty('product')
      expect(response.product.name).toEqual(updateData.name)
      expect(response.product.price).toEqual(updateData.price)
    })

    test('should return 400 for invalid update data', async () => {
      const invalidUpdate = {
        price: -50, // Invalid: negative price
      }

      const res = await app.inject({
        url: `/v1/products/${createdProductId}`,
        method: 'PUT',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
        body: invalidUpdate,
      })

      expect(res.statusCode).toEqual(400)
      const response = res.json()
      expect(response.message).toContain('price must be > 0')
    })

    test('should return 404 for non-existent product', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'
      const res = await app.inject({
        url: `/v1/products/${nonExistentId}`,
        method: 'PUT',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
        body: { name: 'Updated' },
      })

      expect(res.statusCode).toEqual(404)
      const response = res.json()
      expect(response.message).toEqual('Product not found')
    })
  })

  describe('DELETE /products/:id', () => {
    test('should delete a product', async () => {
      const res = await app.inject({
        url: `/v1/products/${createdProductId}`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(204)
    })

    test('should return 404 for non-existent product', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'
      const res = await app.inject({
        url: `/v1/products/${nonExistentId}`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(404)
      const response = res.json()
      expect(response.message).toEqual('Product not found')
    })
  })

  describe('Validation tests', () => {
    test('should validate pagination parameters', async () => {
      const res = await app.inject({
        url: '/v1/products?pageSize=0&pageIndex=-1',
        method: 'GET',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(400)
      const response = res.json()
      expect(response.message).toContain('pageSize must be >= 1')
    })

    test('should validate product ID format', async () => {
      const res = await app.inject({
        url: '/v1/products/invalid-id-format',
        method: 'GET',
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toEqual(400)
      const response = res.json()
      expect(response.message).toContain('must match format "uuid"')
    })
  })

  describe('Authentication tests', () => {
    test('should return 401 without authorization header', async () => {
      const res = await app.inject({
        url: '/v1/products',
        method: 'GET',
      })

      expect(res.statusCode).toEqual(401)
      const response = res.json()
      expect(response).toHaveProperty('message')
    })

    test('should return 401 with invalid API key', async () => {
      const res = await app.inject({
        url: '/v1/products',
        method: 'GET',
        headers: {
          authorization: 'Bearer invalid-key-12345',
        },
      })

      expect(res.statusCode).toEqual(401)
      const response = res.json()
      expect(response).toHaveProperty('message')
    })
  })
})
