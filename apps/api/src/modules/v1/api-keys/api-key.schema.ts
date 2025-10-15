import { FastifySchema } from 'fastify'
import { z } from 'zod'

import {
  apiKeyParamsSchema,
  apiKeyResponseSchema,
  apiKeyWithSecretSchema,
  createApiKeyBodySchema,
  errorReplySchema,
} from '@ecom/common'

import { buildJsonSchemas } from '../../../lib/buildJsonSchema'
import { bindExamples } from '../../../utils/swagger'

// Re-export schemas from common package for buildJsonSchema
export {
  apiKeyParamsSchema,
  apiKeyResponseSchema,
  apiKeyWithSecretSchema,
  createApiKeyBodySchema,
}

// API Key list response schema
const apiKeyListResponseSchema = z.object({
  apiKeys: z.array(apiKeyResponseSchema),
})

// Response schemas
const createApiKeySuccessReplySchema = z.object({
  apiKey: apiKeyWithSecretSchema,
})

const getApiKeysSuccessReplySchema = z.object({
  apiKeys: z.array(apiKeyResponseSchema),
})

// Generated types
export type ApiKeyListResponse = z.infer<typeof apiKeyListResponseSchema>
export type CreateApiKeySuccessOutput = z.infer<
  typeof createApiKeySuccessReplySchema
>
export type GetApiKeysSuccessOutput = z.infer<
  typeof getApiKeysSuccessReplySchema
>
export type ApiKeyErrorOutput = z.infer<typeof errorReplySchema>

// Re-export types from common
export type {
  ApiKeyParams,
  ApiKeyResponse,
  ApiKeyWithSecret,
  CreateApiKeyInput,
} from '@ecom/common'

// Examples for documentation
const apiKeyExample = {
  id: 'clx1234567890abcdef',
  name: 'Production API Key',
  keyPrefix: 'sk_live_',
  isActive: true,
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-15T10:30:00Z'),
}

const apiKeyWithSecretExample = {
  id: 'clx1234567890abcdef',
  name: 'Production API Key',
  keyPrefix: 'sk_live_',
  apiKey: 'sk_live_abc123def456...',
  isActive: true,
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-15T10:30:00Z'),
}

const apiKeyListExample: ApiKeyListResponse = {
  apiKeys: [apiKeyExample],
}

const apiKeyErrorExample: ApiKeyErrorOutput = {
  message: 'API key not found',
  code: 'API_KEY_NOT_FOUND',
}

const schemaExamples = {
  apiKeyExample,
  apiKeyWithSecretExample,
  apiKeyListExample,
  apiKeyErrorExample,
}

// Generate JSON schemas
export const { schemas: apiKeySchemas, $ref: apiKeyRef } = buildJsonSchemas(
  {
    createApiKeyBodySchema,
    apiKeyParamsSchema,
    apiKeyResponseSchema,
    apiKeyWithSecretSchema,
    apiKeyListResponseSchema,
    createApiKeySuccessReplySchema,
    getApiKeysSuccessReplySchema,
    errorReplySchema,
  },
  { $id: 'apiKeySchemas', target: 'openApi3' },
)

// Bind examples to schemas
bindExamples(apiKeySchemas, schemaExamples)

// Fastify schemas for each endpoint
export const createApiKeySchema: FastifySchema = {
  tags: ['API Keys'],
  description: 'Create a new API key for the current store',
  security: [{ apiKey: [] }],
  summary: 'Create a new API key',
  operationId: 'createApiKey',
  body: apiKeyRef('createApiKeyBodySchema'),
  response: {
    '201': apiKeyRef('createApiKeySuccessReplySchema'),
    '400': apiKeyRef('errorReplySchema'),
    '500': apiKeyRef('errorReplySchema'),
  },
}

export const getApiKeysSchema: FastifySchema = {
  tags: ['API Keys'],
  description: 'Get all API keys for the current store',
  security: [{ apiKey: [] }],
  summary: 'Get store API keys',
  operationId: 'getApiKeys',
  response: {
    '200': apiKeyRef('getApiKeysSuccessReplySchema'),
    '500': apiKeyRef('errorReplySchema'),
  },
}

export const deactivateApiKeySchema: FastifySchema = {
  tags: ['API Keys'],
  description: 'Deactivate an API key',
  security: [{ apiKey: [] }],
  summary: 'Deactivate an API key',
  operationId: 'deactivateApiKey',
  params: apiKeyRef('apiKeyParamsSchema'),
  response: {
    '200': {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    '404': apiKeyRef('errorReplySchema'),
    '500': apiKeyRef('errorReplySchema'),
  },
}
