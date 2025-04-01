import { FastifyInstance } from 'fastify'

import { healthSchemas } from './modules/health/health.schema'
import { signinSchemas } from './modules/v1/auth/signin/signin.schema'
import { signupSchemas } from './modules/v1/auth/signup/signup.schema'

export const registerSchemas = async (
  server: FastifyInstance,
): Promise<void> => {
  for (const schema of [...healthSchemas, ...signinSchemas, ...signupSchemas]) {
    server.addSchema(schema)
  }
}
