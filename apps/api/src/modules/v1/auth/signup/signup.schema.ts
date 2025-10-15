import { FastifySchema } from 'fastify'
import { z } from 'zod'

import {
  errorReplySchema,
  signupBodySchema,
  signupSuccessReplySchema,
} from '@ecom/common'

import { buildJsonSchemas } from '../../../../lib/buildJsonSchema'
import { bindExamples } from '../../../../utils/swagger'

// API-specific user schema (for documentation)
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  password: z.string(),
  avatar: z.string().nullish(),
})

// Re-export schemas from common package for buildJsonSchema
export { signupBodySchema, signupSuccessReplySchema }

// Re-export types from common
export type { SignupInput, SignupSuccessOutput } from '@ecom/common'
export type SignupErrorOutput = z.infer<typeof errorReplySchema>

// Examples of schemas from types definitions.
const errorReplySchemaExample: SignupErrorOutput = {
  message: 'Email already exists',
  code: 'EMAIL_ALREADY_EXISTS',
}

const schemaExamples = {
  errorReplySchemaExample,
}

// Generate JSON schemas from zod schemas.
export const { schemas: signupSchemas, $ref: signupRef } = buildJsonSchemas(
  {
    signupBodySchema,
    signupSuccessReplySchema,
    errorReplySchema,
  },
  { $id: 'signupSchemas', target: 'openApi3' },
)

// Bind examples to JSON schemas.
bindExamples(signupSchemas, schemaExamples)

// Export Fastify schemas.
export const schema: FastifySchema = {
  tags: ['Signup'],
  description: 'Signup to the API',
  security: [{ apiKey: [] }],
  summary: 'Signup user and get an access token',
  operationId: 'signup',
  response: {
    '2xx': signupRef('signupSuccessReplySchema'),
    '4xx': signupRef('errorReplySchema'),
    '5xx': signupRef('errorReplySchema'),
  },
}
