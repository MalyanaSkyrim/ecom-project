import { FastifySchema } from 'fastify'
import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

import { bindExamples } from '../../utils/swagger'

// Zod schema definitions.
const healthReplySchema = z.object(
  {
    status: z.string({ description: 'Status of the server' }),
    uptime: z.string({ description: 'Uptime of the server' }),
    docURL: z.string({ description: 'URL of the API documentation' }).url(),
    apiVersions: z.string({ description: 'List of API versions' }),
  },
  { description: 'Reply for the health check' },
)

// Generated types from zod schemas.
export type HealthOutputType = z.infer<typeof healthReplySchema>

// Examples of schemas from types definitions.
const healthReplySchemaExample: HealthOutputType = {
  status: 'OK',
  uptime: '1 hour 2 minutes 3 seconds',
  apiVersions: '1',
  docURL: 'https://www.pragma-project.dev/',
}

const schemaExamples = {
  healthReplySchemaExample,
}

// Generate JSON schemas from zod schemas.
export const { schemas: healthSchemas, $ref: healthRef } = buildJsonSchemas(
  {
    healthReplySchema,
  },
  { $id: 'healthSchemas', target: 'openApi3' },
)

// Bind examples to JSON schemas.
bindExamples(healthSchemas, schemaExamples)

// Export Fastify schemas.
export const schema: FastifySchema = {
  tags: ['Server Health'],
  description: 'Get the health of the server and some useful information.',
  security: [{ apiKey: [] }],
  summary: 'Get server health',
  operationId: 'healthCheck',
  response: { 200: healthRef('healthReplySchema') },
}
