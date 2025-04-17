import { FastifySchema } from 'fastify'
import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

import { bindExamples } from '../../../../utils/swagger'

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  password: z.string(),
  avatar: z.string().nullish(),
})

// Zod schema definitions.
const signupBodySchema = userSchema.omit({
  id: true,
})

const signupSuccessReplySchema = z.object({
  user: userSchema.omit({
    password: true,
  }),
})

const signupErrorReplySchema = z.object(
  {
    message: z.string(),
  },
  { description: 'Reply for the signup' },
)

// Generated types from zod schemas.
export type SignupInput = z.infer<typeof signupBodySchema>
export type SignupSuccessOutput = z.infer<typeof signupSuccessReplySchema>
export type SignupErrorOutput = z.infer<typeof signupErrorReplySchema>

// Examples of schemas from types definitions.
const signupErrorReplySchemaExample: SignupErrorOutput = {
  message: 'Login successful',
}

const schemaExamples = {
  signupErrorReplySchemaExample,
}

// Generate JSON schemas from zod schemas.
export const { schemas: signupSchemas, $ref: signupRef } = buildJsonSchemas(
  {
    '2xx': signupSuccessReplySchema,
    '4xx': signupErrorReplySchema,
    '5xx': signupErrorReplySchema,
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
    '2xx': signupRef('2xx'),
    '4xx': signupRef('4xx'),
    '5xx': signupRef('5xx'),
  },
}
