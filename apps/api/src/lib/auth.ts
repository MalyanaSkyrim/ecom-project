import crypto from 'crypto'

import { db } from '@ecom/database'

/**
 * API Key Management Utilities
 * Handles generation, validation, and storeId extraction from API keys
 */

// API Key configuration
const API_KEY_CONFIG = {
  PREFIX: 'sk_live_',
  SECRET_LENGTH: 32, // 32 bytes = 64 hex characters
  HASH_ALGORITHM: 'sha256',
  HASH_ENCODING: 'hex' as const,
} as const

/**
 * Generate a new API key
 * Format: sk_live_<64-character-secret>
 */
export const generateApiKey = (): string => {
  const secret = crypto
    .randomBytes(API_KEY_CONFIG.SECRET_LENGTH)
    .toString('hex')
  return `${API_KEY_CONFIG.PREFIX}${secret}`
}

/**
 * Hash an API key for secure storage
 */
export const hashApiKey = (apiKey: string): string => {
  return crypto
    .createHash(API_KEY_CONFIG.HASH_ALGORITHM)
    .update(apiKey)
    .digest(API_KEY_CONFIG.HASH_ENCODING)
}

/**
 * Extract the key prefix from an API key
 * e.g., "sk_live_abc123..." -> "sk_live_"
 */
export const extractKeyPrefix = (apiKey: string): string => {
  return apiKey.substring(0, API_KEY_CONFIG.PREFIX.length)
}

/**
 * Validate API key format
 */
export const isValidApiKeyFormat = (apiKey: string): boolean => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false
  }

  // Check if it starts with the correct prefix
  if (!apiKey.startsWith(API_KEY_CONFIG.PREFIX)) {
    return false
  }

  // Check if the secret part has the correct length
  const secret = apiKey.substring(API_KEY_CONFIG.PREFIX.length)
  return secret.length === API_KEY_CONFIG.SECRET_LENGTH * 2 // *2 because hex encoding
}

/**
 * Create a new API key in the database
 */
export const createApiKey = async (
  storeId: string,
  name: string,
): Promise<{ apiKey: string; apiKeyRecord: any }> => {
  // Generate the API key
  const apiKey = generateApiKey()
  const hashedKey = hashApiKey(apiKey)
  const keyPrefix = extractKeyPrefix(apiKey)

  // Create the API key record in the database
  const apiKeyRecord = await db.apiKey.create({
    data: {
      storeId,
      name,
      keyPrefix,
      hashedKey,
      isActive: true,
    },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  return { apiKey, apiKeyRecord }
}

/**
 * Validate an API key and return store information
 */
export const validateApiKey = async (
  apiKey: string,
): Promise<{
  isValid: boolean
  storeId?: string
  apiKeyId?: string
  apiKeyName?: string
  storeName?: string
  error?: string
}> => {
  try {
    // Validate format first
    if (!isValidApiKeyFormat(apiKey)) {
      return {
        isValid: false,
        error: 'Invalid API key format',
      }
    }

    // Hash the provided API key
    const hashedKey = hashApiKey(apiKey)

    // Look up the API key in the database
    const apiKeyRecord = await db.apiKey.findUnique({
      where: {
        hashedKey,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
      },
    })

    // Check if API key exists
    if (!apiKeyRecord) {
      return {
        isValid: false,
        error: 'Invalid API key',
      }
    }

    // Check if API key is active
    if (!apiKeyRecord.isActive) {
      return {
        isValid: false,
        error: 'API key is inactive',
      }
    }

    // Check if the associated store is active
    if (!apiKeyRecord.store.isActive) {
      return {
        isValid: false,
        error: 'Store is inactive',
      }
    }

    // Return success with store information
    return {
      isValid: true,
      storeId: apiKeyRecord.storeId,
      apiKeyId: apiKeyRecord.id,
      apiKeyName: apiKeyRecord.name,
      storeName: apiKeyRecord.store.name,
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Database error during API key validation',
    }
  }
}

/**
 * Deactivate an API key
 */
export const deactivateApiKey = async (apiKeyId: string): Promise<boolean> => {
  try {
    await db.apiKey.update({
      where: { id: apiKeyId },
      data: { isActive: false },
    })
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get all API keys for a store
 */
export const getStoreApiKeys = async (storeId: string) => {
  return db.apiKey.findMany({
    where: { storeId },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Extract API key from Authorization header
 * Supports both "Bearer <token>" and direct token formats
 */
export const extractApiKeyFromHeader = (
  authHeader: string | undefined,
): string | null => {
  if (!authHeader) {
    return null
  }

  // Handle "Bearer <token>" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim()
  }

  // Handle direct token format
  return authHeader.trim()
}

/**
 * Type definitions for the auth module
 */
export interface ApiKeyValidationResult {
  isValid: boolean
  storeId?: string
  apiKeyId?: string
  apiKeyName?: string
  storeName?: string
  error?: string
}

export interface CreateApiKeyResult {
  apiKey: string
  apiKeyRecord: {
    id: string
    storeId: string
    name: string
    keyPrefix: string
    hashedKey: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    store: {
      id: string
      name: string
      slug: string
    }
  }
}
