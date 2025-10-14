import { RouteHandler } from 'fastify'

import {
  createApiKey,
  deactivateApiKey,
  getStoreApiKeys,
} from '../../../lib/auth'
import type { ApiKeyParams, CreateApiKeyInput } from './api-key.schema'

// Type for API key record from database
interface ApiKeyRecord {
  id: string
  name: string
  keyPrefix: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Create API key handler
export const createApiKeyHandler: RouteHandler<{
  Body: CreateApiKeyInput
}> = async (req, reply) => {
  try {
    const { name } = req.body
    const storeId = req.user?.storeId

    if (!storeId) {
      return reply.code(400).send({ message: 'Store ID is required' })
    }

    const { apiKey, apiKeyRecord } = await createApiKey(storeId, name)

    return reply.code(201).send({
      apiKey: {
        id: apiKeyRecord.id,
        name: apiKeyRecord.name,
        keyPrefix: apiKeyRecord.keyPrefix,
        apiKey, // Only returned when creating
        isActive: apiKeyRecord.isActive,
        createdAt: apiKeyRecord.createdAt,
        updatedAt: apiKeyRecord.updatedAt,
      },
    })
  } catch (error) {
    req.log.error(error, 'Error creating API key')
    return reply.code(500).send({ message: 'Internal server error' })
  }
}

// Get API keys handler
export const getApiKeysHandler: RouteHandler = async (req, reply) => {
  try {
    const storeId = req.user?.storeId

    if (!storeId) {
      return reply.code(400).send({ message: 'Store ID is required' })
    }

    const apiKeys = await getStoreApiKeys(storeId)

    return reply.code(200).send({ apiKeys })
  } catch (error) {
    req.log.error(error, 'Error getting API keys')
    return reply.code(500).send({ message: 'Internal server error' })
  }
}

// Deactivate API key handler
export const deactivateApiKeyHandler: RouteHandler<{
  Params: ApiKeyParams
}> = async (req, reply) => {
  try {
    const { id } = req.params
    const storeId = req.user?.storeId

    if (!storeId) {
      return reply.code(400).send({ message: 'Store ID is required' })
    }

    // Verify the API key belongs to the current store
    const apiKeys = await getStoreApiKeys(storeId)
    const apiKeyExists = apiKeys.some((key: ApiKeyRecord) => key.id === id)

    if (!apiKeyExists) {
      return reply.code(404).send({ message: 'API key not found' })
    }

    const success = await deactivateApiKey(id)

    if (!success) {
      return reply.code(500).send({ message: 'Failed to deactivate API key' })
    }

    return reply.code(200).send({ message: 'API key deactivated successfully' })
  } catch (error) {
    req.log.error(error, 'Error deactivating API key')
    return reply.code(500).send({ message: 'Internal server error' })
  }
}
