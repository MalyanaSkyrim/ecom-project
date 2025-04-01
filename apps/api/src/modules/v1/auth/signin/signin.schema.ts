import { FastifySchema } from 'fastify'
import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

import { bindExamples } from '../../../../utils/swagger'

// Zod schema definitions.
const signinBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const signinSuccessReplySchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string().nullish(),
    avatar: z.string().nullish(),
  }),
  accessToken: z.string(),
})

const signinErrorReplySchema = z.object(
  {
    message: z.string(),
  },
  { description: 'Reply for the signin' },
)

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
    '2xx': signinSuccessReplySchema,
    '4xx': signinErrorReplySchema,
    '5xx': signinErrorReplySchema,
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
  response: {
    '2xx': signinRef('2xx'),
    '4xx': signinRef('4xx'),
    '5xx': signinRef('5xx'),
  },
}
