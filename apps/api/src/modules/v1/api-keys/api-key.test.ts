import { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ApiKey, db, type Store, type User } from '@ecom/database'

import { createApiKey } from '../../../lib/auth'
import { build } from '../../../utils/vitestHelper'

describe('API Key Module', () => {
  let server: FastifyInstance
  let apiKey: string
  let storeId: string
  let apiKeyId: string
  let testStore: Store
  let testUser: User

  beforeAll(async () => {
    // Create test server
    server = build()

    // Create a test user first
    testUser = await db.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      },
    })

    // Create a test store
    testStore = await db.store.create({
      data: {
        name: 'Test Store',
        slug: `test-store-${Date.now()}`,
        isActive: true,
      },
    })
    storeId = testStore.id

    // Create store-user relationship
    await db.storeUser.create({
      data: {
        userId: testUser.id,
        storeId: storeId,
        role: 'OWNER',
      },
    })

    // Create API key for the store
    const { apiKey: generatedKey, apiKeyRecord } = await createApiKey(
      storeId,
      'Test API Key',
    )
    apiKey = generatedKey
    apiKeyId = apiKeyRecord.id
  })

  afterAll(async () => {
    // Clean up test data
    if (apiKeyId) {
      await db.apiKey.delete({ where: { id: apiKeyId } }).catch(() => {})
    }
    if (testStore) {
      await db.storeUser.deleteMany({ where: { storeId } }).catch(() => {})
      await db.store.delete({ where: { id: storeId } }).catch(() => {})
    }
    if (testUser) {
      await db.user.delete({ where: { id: testUser.id } }).catch(() => {})
    }
    // Server cleanup is handled by the build() function
  })

  describe('POST /v1/api-keys', () => {
    // it('should create a new API key successfully', async () => {
    //   const res = await server.inject({
    //     method: 'POST',
    //     url: '/v1/api-keys',
    //     headers: {
    //       Authorization: apiKey,
    //     },
    //     payload: {
    //       name: 'New Test API Key',
    //     },
    //   })

    //   expect(res.statusCode).toBe(201)
    //   const body = res.json()
    //   expect(body.apiKey).toBeDefined()
    //   expect(body.apiKey.id).toBeDefined()
    //   expect(body.apiKey.name).toBe('New Test API Key')
    //   expect(body.apiKey.keyPrefix).toBe('sk_live_')
    //   expect(body.apiKey.apiKey).toBeDefined() // The actual key
    //   expect(body.apiKey.isActive).toBe(true)
    //   expect(body.apiKey.createdAt).toBeDefined()
    //   expect(body.apiKey.updatedAt).toBeDefined()

    //   // Clean up the created API key
    //   if (body.apiKey?.id) {
    //     await db.apiKey
    //       .delete({ where: { id: body.apiKey.id } })
    //       .catch(() => {})
    //   }
    // })

    it('should return 400 when name is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/api-keys',
        headers: {
          Authorization: apiKey,
        },
        payload: {},
      })

      expect(res.statusCode).toBe(400)
      const body = res.json()
      expect(body.code).toBe('VALIDATION_ERROR')
      expect(body.data).toBeDefined()
    })

    it('should return 400 when name is empty', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/api-keys',
        headers: {
          Authorization: apiKey,
        },
        payload: {
          name: '',
        },
      })

      expect(res.statusCode).toBe(400)
      const body = res.json()
      expect(body.code).toBe('VALIDATION_ERROR')
      expect(body.data).toBeDefined()
    })

    it('should return 400 when name is too long', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/api-keys',
        headers: {
          Authorization: apiKey,
        },
        payload: {
          name: 'a'.repeat(256), // Exceeds max length of 255
        },
      })

      expect(res.statusCode).toBe(400)
      const body = res.json()
      expect(body.code).toBe('VALIDATION_ERROR')
      expect(body.data).toBeDefined()
    })

    it('should return 401 when Authorization header is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/api-keys',
        payload: {
          name: 'Test API Key',
        },
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('API_KEY_REQUIRED')
    })

    it('should return 401 when API key format is invalid', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/api-keys',
        headers: {
          Authorization: 'invalid-format-key',
        },
        payload: {
          name: 'Test API Key',
        },
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('INVALID_API_KEY_FORMAT')
    })

    it('should return 401 when API key does not exist in database', async () => {
      // Create a properly formatted key that doesn't exist in database
      const nonExistentKey = 'sk_live_' + 'a'.repeat(64) // 64 hex characters
      const res = await server.inject({
        method: 'POST',
        url: '/v1/api-keys',
        headers: {
          Authorization: nonExistentKey,
        },
        payload: {
          name: 'Test API Key',
        },
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('INVALID_API_KEY_FORMAT')
    })

    it('should allow duplicate API key names', async () => {
      // This is a real-world scenario - users might want multiple API keys with the same name
      const firstRes = await server.inject({
        method: 'POST',
        url: '/v1/api-keys',
        headers: {
          Authorization: apiKey,
        },
        payload: {
          name: 'Duplicate Name Test',
        },
      })

      expect(firstRes.statusCode).toBe(201)
      const firstBody = firstRes.json()
      expect(firstBody.apiKey.name).toBe('Duplicate Name Test')

      const secondRes = await server.inject({
        method: 'POST',
        url: '/v1/api-keys',
        headers: {
          Authorization: apiKey,
        },
        payload: {
          name: 'Duplicate Name Test', // Same name
        },
      })

      expect(secondRes.statusCode).toBe(201)
      const secondBody = secondRes.json()
      expect(secondBody.apiKey.name).toBe('Duplicate Name Test')
      expect(secondBody.apiKey.id).not.toBe(firstBody.apiKey.id) // Different IDs

      // Clean up
      await db.apiKey
        .delete({ where: { id: firstBody.apiKey.id } })
        .catch(() => {})
      await db.apiKey
        .delete({ where: { id: secondBody.apiKey.id } })
        .catch(() => {})
    })
  })

  describe('GET /v1/api-keys', () => {
    it('should get all API keys for the store', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/api-keys',
        headers: {
          Authorization: apiKey,
        },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.apiKeys).toBeDefined()
      expect(Array.isArray(body.apiKeys)).toBe(true)

      // Should include the test API key
      const testApiKey = body.apiKeys.find((key: ApiKey) => key.id === apiKeyId)
      expect(testApiKey).toBeDefined()
      expect(testApiKey?.id).toBe(apiKeyId)
      expect(testApiKey?.name).toBe('Test API Key')
      expect(testApiKey?.keyPrefix).toBe('sk_live_')
      expect(testApiKey?.isActive).toBe(true)
      expect(testApiKey?.createdAt).toBeDefined()
      expect(testApiKey?.updatedAt).toBeDefined()
      // Verify dates are recent (within last minute)
      const createdAt = new Date(testApiKey?.createdAt || '')
      const updatedAt = new Date(testApiKey?.updatedAt || '')
      const now = new Date()
      expect(now.getTime() - createdAt.getTime()).toBeLessThan(60000) // Within 1 minute
      expect(now.getTime() - updatedAt.getTime()).toBeLessThan(60000) // Within 1 minute
    })

    it('should return 401 when Authorization header is missing', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/api-keys',
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('API_KEY_REQUIRED')
    })

    it('should return 401 when API key format is invalid', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/api-keys',
        headers: {
          Authorization: 'invalid-format-key',
        },
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('INVALID_API_KEY_FORMAT')
    })
  })

  describe('PUT /v1/api-keys/:id/deactivate', () => {
    let testApiKeyId: string

    beforeAll(async () => {
      // Create a test API key to deactivate
      const { apiKeyRecord } = await createApiKey(
        storeId,
        'Test Deactivate Key',
      )
      testApiKeyId = apiKeyRecord.id
    })

    afterAll(async () => {
      // Clean up the test API key
      if (testApiKeyId) {
        await db.apiKey.delete({ where: { id: testApiKeyId } }).catch(() => {})
      }
    })

    it('should deactivate an API key successfully', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: `/v1/api-keys/${testApiKeyId}/deactivate`,
        headers: {
          Authorization: apiKey,
        },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()

      // Verify the API key is actually deactivated
      const deactivatedKey = await db.apiKey.findUnique({
        where: { id: testApiKeyId },
      })
      expect(deactivatedKey?.isActive).toBe(false)
    })

    it('should allow deactivating an already deactivated API key (idempotent)', async () => {
      // Create a new API key to deactivate twice
      const { apiKeyRecord: tempApiKey } = await createApiKey(
        storeId,
        'Temp API Key for Double Deactivate',
      )

      // First deactivation should succeed
      const firstRes = await server.inject({
        method: 'PUT',
        url: `/v1/api-keys/${tempApiKey.id}/deactivate`,
        headers: {
          Authorization: apiKey,
        },
      })
      expect(firstRes.statusCode).toBe(200)

      // Second deactivation should also succeed (idempotent operation)
      const secondRes = await server.inject({
        method: 'PUT',
        url: `/v1/api-keys/${tempApiKey.id}/deactivate`,
        headers: {
          Authorization: apiKey,
        },
      })
      expect(secondRes.statusCode).toBe(200)
      const body = secondRes.json()

      // Clean up
      await db.apiKey.delete({ where: { id: tempApiKey.id } }).catch(() => {})
    })

    it('should return 404 when API key does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'
      const res = await server.inject({
        method: 'PUT',
        url: `/v1/api-keys/${nonExistentId}/deactivate`,
        headers: {
          Authorization: apiKey,
        },
      })

      expect(res.statusCode).toBe(404)
      const body = res.json()
      expect(body.code).toBe('API_KEY_NOT_FOUND')
    })

    it('should return 400 when API key ID is invalid UUID format', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/api-keys/invalid-uuid/deactivate',
        headers: {
          Authorization: apiKey,
        },
      })

      expect(res.statusCode).toBe(400)
      const body = res.json()
      expect(body.code).toBe('VALIDATION_ERROR')
      expect(body.data).toBeDefined()
    })

    it('should return 401 when Authorization header is missing', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: `/v1/api-keys/${testApiKeyId}/deactivate`,
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('API_KEY_REQUIRED')
    })

    it('should return 401 when API key format is invalid', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: `/v1/api-keys/${testApiKeyId}/deactivate`,
        headers: {
          Authorization: 'invalid-format-key',
        },
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('INVALID_API_KEY_FORMAT')
    })
  })

  describe('API Key Security', () => {
    it('should not allow access to API keys from different stores', async () => {
      // Create another user and store
      const otherUser = await db.user.create({
        data: {
          firstName: 'Other',
          lastName: 'User',
          email: `other-${Date.now()}@example.com`,
        },
      })

      const otherStore = await db.store.create({
        data: {
          name: 'Other Store',
          slug: `other-store-${Date.now()}`,
          isActive: true,
        },
      })

      await db.storeUser.create({
        data: {
          userId: otherUser.id,
          storeId: otherStore.id,
          role: 'OWNER',
        },
      })

      await createApiKey(otherStore.id, 'Other Store Key')

      // Try to access API keys from the other store using our API key
      const res = await server.inject({
        method: 'GET',
        url: '/v1/api-keys',
        headers: {
          Authorization: apiKey, // Our store's API key
        },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()

      // Should only return API keys from our store, not the other store
      const otherStoreKeys = body.apiKeys.filter(
        (key: ApiKey) => key.name === 'Other Store Key',
      )
      expect(otherStoreKeys).toHaveLength(0)

      // Clean up
      await db.apiKey.deleteMany({ where: { storeId: otherStore.id } })
      await db.storeUser.deleteMany({ where: { storeId: otherStore.id } })
      await db.store.delete({ where: { id: otherStore.id } })
      await db.user.delete({ where: { id: otherUser.id } })
    })

    it('should not allow deactivating API keys from different stores', async () => {
      // Create another user and store
      const otherUser = await db.user.create({
        data: {
          firstName: 'Other',
          lastName: 'User',
          email: `other2-${Date.now()}@example.com`,
        },
      })

      const otherStore = await db.store.create({
        data: {
          name: 'Other Store 2',
          slug: `other-store-2-${Date.now()}`,
          isActive: true,
        },
      })

      await db.storeUser.create({
        data: {
          userId: otherUser.id,
          storeId: otherStore.id,
          role: 'OWNER',
        },
      })

      const { apiKeyRecord: otherApiKeyRecord } = await createApiKey(
        otherStore.id,
        'Other Store Key 2',
      )

      // Try to deactivate the other store's API key using our API key
      const res = await server.inject({
        method: 'PUT',
        url: `/v1/api-keys/${otherApiKeyRecord.id}/deactivate`,
        headers: {
          Authorization: apiKey, // Our store's API key
        },
      })

      expect(res.statusCode).toBe(404)
      const body = res.json()
      expect(body.code).toBe('API_KEY_NOT_FOUND')

      // Clean up
      await db.apiKey.delete({ where: { id: otherApiKeyRecord.id } })
      await db.storeUser.deleteMany({ where: { storeId: otherStore.id } })
      await db.store.delete({ where: { id: otherStore.id } })
      await db.user.delete({ where: { id: otherUser.id } })
    })
  })

  describe('API Key Format Validation', () => {
    it('should reject API keys with wrong prefix', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/api-keys',
        headers: {
          Authorization:
            'sk_test_123456789012345678901234567890123456789012345678901234567890',
        },
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('INVALID_API_KEY_FORMAT')
    })

    it('should reject API keys with wrong length', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/api-keys',
        headers: {
          Authorization: 'sk_live_short',
        },
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('INVALID_API_KEY_FORMAT')
    })

    it('should accept Bearer token format', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/api-keys',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.apiKeys).toBeDefined()
      expect(Array.isArray(body.apiKeys)).toBe(true)
      // Verify we get the expected API key back
      const foundApiKey = body.apiKeys.find(
        (key: ApiKey) => key.id === apiKeyId,
      )
      expect(foundApiKey).toBeDefined()
    })

    it('should work with authenticated endpoints', async () => {
      // Test that our API key works with other authenticated endpoints
      const res = await server.inject({
        method: 'GET',
        url: '/v1/products',
        headers: {
          Authorization: apiKey,
        },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.data).toBeDefined()
      expect(Array.isArray(body.data)).toBe(true)
    })

    it('should reject deactivated API keys', async () => {
      // Create a new API key and then deactivate it
      const { apiKey: tempApiKey, apiKeyRecord: tempApiKeyRecord } =
        await createApiKey(storeId, 'Temporary API Key for Deactivation Test')

      // Deactivate the API key
      await server.inject({
        method: 'PUT',
        url: `/v1/api-keys/${tempApiKeyRecord.id}/deactivate`,
        headers: {
          Authorization: apiKey,
        },
      })

      // Try to use the deactivated API key
      const res = await server.inject({
        method: 'GET',
        url: '/v1/api-keys',
        headers: {
          Authorization: tempApiKey,
        },
      })

      expect(res.statusCode).toBe(401)
      const body = res.json()
      expect(body.code).toBe('API_KEY_INACTIVE')

      // Clean up
      await db.apiKey
        .delete({ where: { id: tempApiKeyRecord.id } })
        .catch(() => {})
    })
  })
})
