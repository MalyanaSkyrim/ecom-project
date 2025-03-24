import { FastifyInstance } from 'fastify'

import { healthSchemas } from './modules/health/health.schema'

export const registerSchemas = async (
  server: FastifyInstance,
): Promise<void> => {
  for (const schema of [...healthSchemas]) {
    server.addSchema(schema)
  }
}
