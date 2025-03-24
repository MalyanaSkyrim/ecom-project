import { JsonSchema } from 'fastify-zod'

export type Property = {
  type: string
  properties: {
    [key: string]: object
  }
  example: object
}

export type MyJsonSchema = JsonSchema & {
  properties?: { [key: string]: Property }
}
