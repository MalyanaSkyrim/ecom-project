import * as dotenv from 'dotenv'
import fs from 'fs'

import { version } from '../package.json'
import { env } from './env'
import { createServer, generateSwaggerDocs, type ServerOptions } from './server'

dotenv.config({ path: '../../.env' })

const loggerLabels = {
  service: 'api-sync',
  serviceType: 'api' as const,
  environment: env.APP_ENV,
  version,
  hostname: env.API_URL,
}

const prodConfig: ServerOptions = {
  disableRequestLogging: true,
  bodyLimit: 20000000,
  //Todo: create logger
  // loggerInstance: getLogger({
  //   labels: loggerLabels,
  //   loggerOptions: { name: 'Ecom_API' },
  //   usePretty: false,
  // }),
  isDocPrivate: false,
}

export const devConfig: ServerOptions = {
  disableRequestLogging: true,
  bodyLimit: 20000000,
  // loggerInstance: getLogger({
  //   labels: loggerLabels,
  //   usePretty: true,
  // }),
  isDocPrivate: true,
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
