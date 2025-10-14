import { closeServer, createServer } from '../server'

const server = createServer({
  logger: false,
  // generateDoc defaults to false, so all plugins (including identity) will load
})

export function build() {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(() => {
    closeServer(server)
  })

  return server
}
