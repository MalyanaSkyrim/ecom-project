import { FastifySchema } from 'fastify'
import { z } from 'zod'

import { buildJsonSchemas } from '../../../../lib/buildJsonSchema'
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

const signinErrorReplySchema = z
  .object({
    message: z.string(),
  })
  .meta({ description: 'Reply for the signin' })

// Generated types from zod schemas.
export type SigninInput = z.infer<typeof signinBodySchema>
export type SigninSuccessOutput = z.infer<typeof signinSuccessReplySchema>
export type SigninErrorOutput = z.infer<typeof signinErrorReplySchema>

// Examples of schemas from types definitions.
const signinErrorReplySchemaExample: SigninErrorOutput = {
  message: 'Login successful',
}

const schemaExamples = {
  signinErrorReplySchemaExample,
}

// Generate JSON schemas from zod schemas.
export const { schemas: signinSchemas, $ref: signinRef } = buildJsonSchemas(
  {
    signinBodySchema,
    signinSuccessReplySchema,
    signinErrorReplySchema,
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
    '4xx': signinRef('signinErrorReplySchema'),
    '5xx': signinRef('signinErrorReplySchema'),
  },
}
