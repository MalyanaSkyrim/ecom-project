import { FastifyDynamicSwaggerOptions, JSONObject } from '@fastify/swagger'

import { env } from '../env'

const publicTags = [
  {
    name: 'Server Health',
    description:
      'This section contains an endpoint for checking if the server is online.',
  },
]

export const getDocsConfig = (
  isPrivate = false,
): FastifyDynamicSwaggerOptions => ({
  stripBasePath: true,
  hideUntagged: true,
  openapi: {
    info: {
      title: 'eCommerce API',
      description:
        'eCommerce provides a REST API exposing to manage the e-commerce data.',
      version: '1',
      contact: {
        name: 'Pragma Project',
        email: 'florion@popina.com',
        url: 'https://www.pragma-project.dev',
      },
    },
    servers: [
      {
        url: env.API_URL || 'http://localhost:4000',
      },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
          description:
            "To get an API key, please contact us. We'll be happy to help you.",
        },
        serviceKey: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
          description: 'To get the service key, please contact us.',
        },
      },
    },
    externalDocs: {
      url: 'https://www.pragma-project.dev/docs/getting-started',
      description: 'Pragma Sync API specifications',
    },
    tags: isPrivate ? [...publicTags] : publicTags,
  },
  transform: ({ schema, url }) => {
    const transformedSchema = { ...schema }

    if (isPrivate) {
      transformedSchema.hide = false
    }

    return {
      schema: transformedSchema as unknown as JSONObject,
      url,
    }
  },
})
