import { FastifyPluginAsync } from 'fastify'

import {
  createApiKeyHandler,
  deactivateApiKeyHandler,
  getApiKeysHandler,
} from './api-key.controller'
import {
  createApiKeySchema,
  deactivateApiKeySchema,
  getApiKeysSchema,
} from './api-key.schema'

/**
 * API Key routes plugin
 * Provides management operations for API keys
 */
const apiKeyRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // GET /api-keys - Get all API keys for the current store
  fastify.get(
    '/',
    {
      schema: getApiKeysSchema,
    },
    getApiKeysHandler,
  )

  // POST /api-keys - Create a new API key
  fastify.post(
    '/',
    {
      schema: createApiKeySchema,
    },
    createApiKeyHandler,
  )

  // PUT /api-keys/:id/deactivate - Deactivate an API key
  fastify.put(
    '/:id/deactivate',
    {
      schema: deactivateApiKeySchema,
    },
    deactivateApiKeyHandler,
  )
}

export default apiKeyRoutes
