import { FastifySchema } from 'fastify'
import { z } from 'zod'

import { buildJsonSchemas } from '../../../../lib/buildJsonSchema'
import { errorReplySchema } from '../../../../lib/error'
import { bindExamples } from '../../../../utils/swagger'

// Zod schema definitions.
const signinBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

const signinSuccessReplySchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string().nullish(),
    avatar: z.string().nullish(),
  }),
  accessToken: z.string(),
})

// Generated types from zod schemas.
export type SigninInput = z.infer<typeof signinBodySchema>
export type SigninSuccessOutput = z.infer<typeof signinSuccessReplySchema>
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
