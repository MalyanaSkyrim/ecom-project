import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

import { extractApiKeyFromHeader, validateApiKey } from '../lib/auth'

/**
 * Extend FastifyRequest to include user information
 */
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      storeId: string
      apiKeyId: string
      apiKeyName: string
      storeName: string
    }
  }
}

/**
 * Identity Plugin
 *
 * This plugin validates API keys from the Authorization header and attaches
 * user/store information to the request object.
 *
 * It supports both "Bearer <token>" and direct token formats in the Authorization header.
 */
const identityPlugin: FastifyPluginAsync = async (fastify) => {
  // Add preHandler hook to validate API keys
  fastify.addHook('preHandler', async (request: FastifyRequest, reply) => {
    // Skip authentication for health check and public routes
    const publicRoutes = ['/health', '/docs', '/docs/json', '/docs/yaml']

    if (publicRoutes.some((route) => request.url.startsWith(route))) {
      return
    }

    // Skip authentication for auth routes (signin, signup)
    const authRoutes = ['/signin', '/signup']
    if (authRoutes.some((route) => request.url.includes(route))) {
      return
    }

    try {
      // Extract API key from Authorization header
      const authHeader = request.headers.authorization
      const apiKey = extractApiKeyFromHeader(authHeader)

      if (!apiKey) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message:
            'API key is required. Please provide a valid API key in the Authorization header.',
          code: 'MISSING_API_KEY',
        })
      }

      // Validate the API key
      const validationResult = await validateApiKey(apiKey)

      if (!validationResult.isValid) {
        const errorCode =
          validationResult.error === 'Invalid API key format'
            ? 'INVALID_API_KEY_FORMAT'
            : validationResult.error === 'API key is inactive'
              ? 'INACTIVE_API_KEY'
              : validationResult.error === 'Store is inactive'
                ? 'INACTIVE_STORE'
                : 'INVALID_API_KEY'

        return reply.code(401).send({
          error: 'Unauthorized',
          message: validationResult.error || 'Invalid API key',
          code: errorCode,
        })
      }

      // Attach user information to the request
      request.user = {
        storeId: validationResult.storeId!,
        apiKeyId: validationResult.apiKeyId!,
        apiKeyName: validationResult.apiKeyName!,
        storeName: validationResult.storeName!,
      }

      // Log successful authentication (optional, for debugging)
      if (process.env.NODE_ENV === 'development') {
        fastify.log.debug(
          {
            storeId: request.user.storeId,
            storeName: request.user.storeName,
            apiKeyName: request.user.apiKeyName,
            url: request.url,
            method: request.method,
          },
          'API key validated successfully',
        )
      }
    } catch (error) {
      fastify.log.error(error, 'Error during API key validation')
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'An error occurred while validating your API key',
        code: 'VALIDATION_ERROR',
      })
    }
  })

  // Add a helper method to check if a request is authenticated
  fastify.decorate('isAuthenticated', (request: FastifyRequest): boolean => {
    return !!request.user?.storeId
  })

  // Add a helper method to get the current store ID
  fastify.decorate(
    'getCurrentStoreId',
    (request: FastifyRequest): string | null => {
      return request.user?.storeId || null
    },
  )
}

export default fp(identityPlugin, {
  fastify: '5.x',
  name: 'identity-plugin',
})
