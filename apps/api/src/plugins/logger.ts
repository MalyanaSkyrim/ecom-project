import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

import { env } from '../env'
import { ServerLogDataResolver } from '../utils/loggerHelper'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoggerPluginOptions {
  // Specify Logger plugin options here
}

async function fastifyDatadog(fastify: FastifyInstance) {
  const logDataResolver = new ServerLogDataResolver({
    env: env.NODE_ENV,
  })

  // Uncomment this to see the full request and response logs (e.g.: from POS)
  // fastify.addHook('preValidation', async (req) => {
  //   console.log(req)
  // })

  fastify.addHook('onRequest', async (req) => {
    const logData = logDataResolver.onRequest(req)
    fastify.log.info(logData.data, logData.message)
  })

  fastify.addHook('onError', async (req, _, error) => {
    const logData = logDataResolver.onError(req, error)
    fastify.log.error(logData.data, logData.message)
  })

  fastify.addHook('onSend', async (req, reply, payload) => {
    const logData = logDataResolver.onSend(req, reply, payload)
    if (reply.statusCode >= 400) {
      fastify.log.warn(logData.data, logData.message)
    }
    fastify.log.info(logData.data, logData.message)
  })
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<LoggerPluginOptions>(fastifyDatadog, {
  fastify: '5.x',
  name: 'fastify-datadog',
})
