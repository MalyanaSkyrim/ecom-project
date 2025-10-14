import { FastifyInstance } from 'fastify'

import { healthSchemas } from './modules/health/health.schema'
import { apiKeySchemas } from './modules/v1/api-keys/api-key.schema'
import { signinSchemas } from './modules/v1/auth/signin/signin.schema'
import { signupSchemas } from './modules/v1/auth/signup/signup.schema'
import { productSchemas } from './modules/v1/products/product.schema'

export const registerSchemas = async (
  server: FastifyInstance,
): Promise<void> => {
  for (const schema of [
    ...healthSchemas,
    ...signinSchemas,
    ...signupSchemas,
    ...productSchemas,
    ...apiKeySchemas,
  ]) {
    server.addSchema(schema)
  }
}
