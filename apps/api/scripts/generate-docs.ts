import * as dotenv from 'dotenv'

import { closeServer, createServer, generateSwaggerDocs } from '../src/server'

dotenv.config()

export const generateDoc = async () => {
  const server = createServer({
    generateDoc: true,
  })
  await server
    .listen({
      port: 6001,
      host: '0.0.0.0',
    })
    .then(async () => {
      generateSwaggerDocs(server)
        .then((r) => {
          console.info(
            `✔ Generated Swagger file to ${r.path} in ${r.duration}ms`,
          )
        })
        .catch((e) => {
          console.error(e)
          process.exit(1)
        })
    })
    .finally(async () => {
      await closeServer(server)
    })
}

const run = async () => {
  await generateDoc()
  process.exit(0)
}
run()
