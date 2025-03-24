import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'

declare module 'fastify-zod' {
  export function withRefResolver<T>(
    schema: T,
  ): T & FastifyDynamicSwaggerOptions
}
