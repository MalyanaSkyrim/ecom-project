import autoload from '@fastify/autoload'
import * as dotenv from 'dotenv'
import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { db } from '@ecom/database'

import { registerSchemas } from './schemas'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface ServerOptions extends FastifyServerOptions {
  isDocPrivate?: boolean
  generateDoc?: boolean
}

/**
 * Builder to create a Fastify server instance.
 * @param opts Fastify server options.
 * @see https://www.fastify.io/docs/latest/Reference/Server/
 */
export const createServer = (opts: ServerOptions = {}) => {
  const fastify = Fastify({
    // The example attribute for OpenAPI is disturbed by Ajv validation, so it
    // should be log output only.
    ajv: {
      customOptions: {
        strict: 'log',
        keywords: ['example'],
      },
    },
    ...opts,
  })

  // Register schemas
  registerSchemas(fastify)

  // Register all plugins in the `src/plugins` directory.
  fastify.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
    ignoreFilter: opts.generateDoc ? /(rate-limit|identity)/ : undefined,
    maxDepth: 0,
  })

  // Register all modules in the `src/modules` directory.
  fastify.register(autoload, {
    dir: path.join(__dirname, 'modules'),
    // Entry point of each module is named `*.router.ts`.
    indexPattern: /.*\.router\.[jt]s/,
    // Match all files ending with `*.router.ts`.
    // https://regex101.com/r/OXuR9c/1
    matchFilter: /^.*\.router\.[jt]s$/,
    options: opts,
  })

  /**
   * Print the representation of the internal radix tree used by the router
   * @see https://www.fastify.io/docs/latest/Reference/Server/#printroutes
   * Uncomment the following line to enable it
   */
  // if (process.env.NODE_ENV === 'development') {
  //   fastify.ready(() => {
  //     fastify.log.info(fastify.printRoutes())
  //   })
  // }

  /**
   * Print the representation of the internal plugin tree,
   * useful for debugging require order issues.
   * @see https://www.fastify.io/docs/latest/Reference/Server/#printplugins
   * Uncomment the following line to enable it
   */
  // if (process.env.NODE_ENV === 'development') {
  //   fastify.ready(() => {
  //     fastify.log.info(fastify.printPlugins())
  //   })
  // }

  return fastify
}

/**
 * Properly close the server and services
 * @param server Fastify server instance.
 * @see https://www.fastify.io/docs/latest/Reference/Server/#close
 * @description This function is used to close the server and services after all
 * tests are done (see `vitestHelper.ts`) or after the swagger docs are generated
 * (see `generate-docs.ts` file).
 */
export async function closeServer(server: FastifyInstance) {
  server.log.info('Closing up server and resources...')
  await db.$disconnect()
  await server.close()
}

/**
 * This function generates the OpenAPI documentation for the server.
 * @param server Fastify server instance.
 */
export const generateSwaggerDocs = async (server: FastifyInstance) => {
  // Get the execute duration
  const start = Date.now()

  // Generate OpenAPI documentation
  const swaggerJson = server.swagger()

  const path = `generated/api-swagger.json`

  // Write the OpenAPI documentation to the `generated` directory. This file is
  // used by the Website app for the API documentation.
  fs.writeFileSync(path, JSON.stringify(swaggerJson))

  // get duration in milliseconds
  const duration = Date.now() - start

  return {
    path,
    duration,
  }
}
