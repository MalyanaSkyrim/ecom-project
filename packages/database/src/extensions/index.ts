import { PrismaClient } from '@prisma/client'

import { RetryTransaction } from './retry-transaction'

/**
 * Creates a new instance of the database client and add extensions to it.
 *
 * @param options - The options to configure the database client.
 * @returns The extended database client instance.
 */
export const createDbInstance = () => {
  const { PRISMA_VERBOSE = 'error' } = process.env
  let dbToCreate: PrismaClient
  if (PRISMA_VERBOSE === 'error') {
    dbToCreate = new PrismaClient({ log: ['error'] })
  } else if (PRISMA_VERBOSE === 'warn') {
    dbToCreate = new PrismaClient({ log: ['error', 'warn'] })
  } else if (PRISMA_VERBOSE === 'info') {
    dbToCreate = new PrismaClient({ log: ['error', 'warn', 'info'] })
  } else if (PRISMA_VERBOSE === 'query') {
    const verboseDbToCreate = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'info' },
      ],
    })
    verboseDbToCreate.$on('query', (event) => {
      console.log('📮 Query: ' + event.query)
      console.log('💉 Param: ' + event.params)
      console.log('🚅 Duration: ' + event.duration + 'ms')
      console.log('🎯 Target: ' + event.target)
      console.log('⌛ Timestamp: ' + event.timestamp)
    })
    dbToCreate = verboseDbToCreate
  } else {
    throw new Error(`Invalid value for PRISMA_VERBOSE: ${PRISMA_VERBOSE}`)
  }

  return dbToCreate.$extends(
    RetryTransaction({
      jitter: 'full',
      numOfAttempts: 5,
    }),
    /**
     * We don't need to use the extension type because we don't have extended functions yet.
     * Therefore, we assert the return type as PrismaClient.
     */
  ) as unknown as PrismaClient
}
