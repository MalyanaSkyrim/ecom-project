import { closeServer, createServer } from '../server'

const server = createServer({ logger: false })

export function build() {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(() => {
    closeServer(server)
  })

  return server
}
