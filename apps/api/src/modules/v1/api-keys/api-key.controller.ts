import { RouteHandler } from 'fastify'

import {
  createApiKey,
  deactivateApiKey,
  getStoreApiKeys,
} from '../../../lib/auth'
import {
  ApiKeyDeactivationFailedError,
  ApiKeyNotFoundError,
  StoreIdRequiredError,
} from '../../../lib/error'
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
  const { name } = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
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
}

// Get API keys handler
export const getApiKeysHandler: RouteHandler = async (req, reply) => {
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  const apiKeys = await getStoreApiKeys(storeId)

  return reply.code(200).send({ apiKeys })
}

// Deactivate API key handler
export const deactivateApiKeyHandler: RouteHandler<{
  Params: ApiKeyParams
}> = async (req, reply) => {
  const { id } = req.params
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new StoreIdRequiredError()
  }

  // Verify the API key belongs to the current store
  const apiKeys = await getStoreApiKeys(storeId)
  const apiKeyExists = apiKeys.some((key: ApiKeyRecord) => key.id === id)

  if (!apiKeyExists) {
    throw new ApiKeyNotFoundError({
      message: `API key with ID '${id}' not found in your store.`,
      meta: { apiKeyId: id, storeId },
    })
  }

  const success = await deactivateApiKey(id)

  if (!success) {
    throw new ApiKeyDeactivationFailedError({
      message:
        'Failed to deactivate API key. Please try again or contact support if the issue persists.',
      meta: { apiKeyId: id, storeId },
    })
  }

  return reply.code(200).send({ message: 'API key deactivated successfully' })
}
