import { FastifySchema } from 'fastify'
import { z } from 'zod'

import { buildJsonSchemas } from '../../../lib/buildJsonSchema'
import { errorReplySchema } from '../../../lib/error'
import { bindExamples } from '../../../utils/swagger'

// API Key creation schema
const createApiKeyBodySchema = z.object({
  name: z.string().min(1).max(255),
})

// API Key response schema
const apiKeyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  keyPrefix: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const apiKeyWithSecretSchema = z.object({
  id: z.string(),
  name: z.string(),
  keyPrefix: z.string(),
  apiKey: z.string(), // Only returned when creating a new key
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// API Key list response schema
const apiKeyListResponseSchema = z.object({
  apiKeys: z.array(apiKeyResponseSchema),
})

// API Key params schema
const apiKeyParamsSchema = z.object({
  id: z.string().uuid(),
})

// Response schemas
const createApiKeySuccessReplySchema = z.object({
  apiKey: apiKeyWithSecretSchema,
})

const getApiKeysSuccessReplySchema = z.object({
  apiKeys: z.array(apiKeyResponseSchema),
})

// Generated types
export type CreateApiKeyInput = z.infer<typeof createApiKeyBodySchema>
export type ApiKeyParams = z.infer<typeof apiKeyParamsSchema>
export type ApiKeyResponse = z.infer<typeof apiKeyResponseSchema>
export type ApiKeyWithSecret = z.infer<typeof apiKeyWithSecretSchema>
export type ApiKeyListResponse = z.infer<typeof apiKeyListResponseSchema>
export type CreateApiKeySuccessOutput = z.infer<
  typeof createApiKeySuccessReplySchema
>
export type GetApiKeysSuccessOutput = z.infer<
  typeof getApiKeysSuccessReplySchema
>
export type ApiKeyErrorOutput = z.infer<typeof errorReplySchema>

// Examples for documentation
const apiKeyExample: ApiKeyResponse = {
  id: 'clx1234567890abcdef',
  name: 'Production API Key',
  keyPrefix: 'sk_live_',
  isActive: true,
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-15T10:30:00Z'),
}

const apiKeyWithSecretExample: ApiKeyWithSecret = {
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
