import { FastifySchema } from 'fastify'
import { z } from 'zod'

import { buildJsonSchemas } from '../../../../lib/buildJsonSchema'
import { errorReplySchema } from '../../../../lib/error'
import { bindExamples } from '../../../../utils/swagger'

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
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

// Generated types from zod schemas.
export type SignupInput = z.infer<typeof signupBodySchema>
export type SignupSuccessOutput = z.infer<typeof signupSuccessReplySchema>
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
