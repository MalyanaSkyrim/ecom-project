import { FastifySchema } from 'fastify'
import { z } from 'zod'

import {
  errorReplySchema,
  signinBodySchema,
  signinSuccessReplySchema,
} from '@ecom/common'

import { buildJsonSchemas } from '../../../../lib/buildJsonSchema'
import { bindExamples } from '../../../../utils/swagger'

// Re-export schemas from common package for buildJsonSchema
export { signinBodySchema, signinSuccessReplySchema }

// Re-export types from common
export type { SigninInput, SigninSuccessOutput } from '@ecom/common'
export type SigninErrorOutput = z.infer<typeof errorReplySchema>

// Examples of schemas from types definitions.
const errorReplySchemaExample: SigninErrorOutput = {
  message: 'User not found',
  code: 'USER_NOT_FOUND',
}

const schemaExamples = {
  errorReplySchemaExample,
}

// Generate JSON schemas from zod schemas.
export const { schemas: signinSchemas, $ref: signinRef } = buildJsonSchemas(
  {
    signinBodySchema,
    signinSuccessReplySchema,
    errorReplySchema,
  },
  { $id: 'signinSchemas', target: 'openApi3' },
)

// Bind examples to JSON schemas.
bindExamples(signinSchemas, schemaExamples)

// Export Fastify schemas.
export const schema: FastifySchema = {
  tags: ['Signin'],
  description: 'Signin to the API',
  security: [{ apiKey: [] }],
  summary: 'Signin user and get an access token',
  operationId: 'signin',
  body: signinRef('signinBodySchema'),
  response: {
    '2xx': signinRef('signinSuccessReplySchema'),
    '4xx': signinRef('errorReplySchema'),
    '5xx': signinRef('errorReplySchema'),
  },
}
