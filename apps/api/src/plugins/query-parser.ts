import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import qs, { IParseOptions } from 'qs'

interface FastifyQsOptions extends IParseOptions {
  /**
   * Format for parsing arrays in query strings
   * @default 'indices'
   * @example 'sorting[0][id]=name'&sorting[0][direction]=asc becomes [{id: 'name', direction: 'asc'}]
   */
  arrayFormat?: 'brackets' | 'indices' | 'repeat' | 'comma'

  /**
   * Parse primitives (numbers, booleans)
   * @default true
   */
  parsePrimitives?: boolean
}

const fastifyQsPlugin: FastifyPluginCallback<FastifyQsOptions> = (
  fastify,
  options = {},
  done,
) => {
  const {
    arrayFormat,
    depth = 10,
    parameterLimit = 1000,
    ...otherOptions
  } = options

  const parseOptions: FastifyQsOptions = {
    arrayFormat,
    depth,
    parameterLimit,
    ...otherOptions,
  }

  // Set the custom querystring parser
  fastify.addHook('onRequest', async (request) => {
    const urlParts = request.url.split('?')

    if (urlParts.length > 1) {
      const queryString = urlParts.slice(1).join('?')

      if (queryString) {
        try {
          const parsed = qs.parse(queryString, parseOptions)
          request.query = parsed
        } catch (error) {
          fastify.log.error(
            { error, queryString },
            'Failed to parse query string',
          )
          // Keep original query on error
        }
      }
    }
  })

  done()
}

export default fp(fastifyQsPlugin, {
  name: 'fastify-qs-parser',
})
