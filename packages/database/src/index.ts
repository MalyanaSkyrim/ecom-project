import { PrismaClient } from '@prisma/client'

import { env } from './env'
import { createDbInstance } from './extensions'

declare global {
  // allow global `var` declarations
  /* eslint-disable no-var*/
  var db: PrismaClient | undefined
}

let db: PrismaClient

if (env.NODE_ENV === 'production') {
  db = createDbInstance()
} else {
  if (!global.db) {
    global.db = createDbInstance()
  }
  db = global.db
}

export * from '@prisma/client'
export { db }
