import * as dotenv from 'dotenv'
import fs from 'fs'
import pino from 'pino'
import pretty from 'pino-pretty'

import { env } from './env'
import { createServer, generateSwaggerDocs, type ServerOptions } from './server'

dotenv.config({ path: '../../.env' })

// const loggerLabels = {
//   service: 'api',
//   serviceType: 'api' as const,
//   environment: env.APP_ENV,
//   version,
//   hostname: env.API_URL,
// }

const prodConfig: ServerOptions = {
  disableRequestLogging: true,
  bodyLimit: 20000000,
  loggerInstance: pino({
    name: 'ecom-api',
  }),
  isDocPrivate: false,
  generateDoc: true,
}

export const devConfig: ServerOptions = {
  disableRequestLogging: true,
  bodyLimit: 20000000,
  loggerInstance: pino(
    {},
    pretty({
      levelFirst: true,
      colorize: true,
      colorizeObjects: true,
      translateTime: 'HH:MM:ss.l',
      ignore: 'hostname,pid,labels',
    }),
  ),
  isDocPrivate: true,
  generateDoc: true,
}

const server = createServer(
  env.NODE_ENV === 'production' ? prodConfig : devConfig,
)

const start = async () => {
  try {
    await server.listen({
      port: +env.API_PORT,
      host: '0.0.0.0',
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }

  try {
    // check we're running in a docker container
    if (env.NODE_ENV === 'development') {
      const isDocker =
        // cspell:disable-next-line
        fs.access('/.dockerenv', fs.constants.F_OK, (err) =>
          server.log.info(
            `Service ${err ? "isn't" : 'is'} running in a Docker container`,
          ),
        ) !== null
      if (!isDocker) {
        generateSwaggerDocs(server)
      }
    }
  } catch (error) {
    server.log.error(error)
  }
}

start()
