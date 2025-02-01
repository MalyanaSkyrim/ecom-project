import { Prisma } from '@prisma/client'
import { backOff, IBackOffOptions } from 'exponential-backoff'

export function RetryTransaction(options?: Partial<IBackOffOptions>) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      name: 'RetryTransaction',
      client: {
        $transaction(...args: Parameters<(typeof prisma)['$transaction']>) {
          // eslint-disable-next-line prefer-spread
          return backOff(() => prisma.$transaction.apply(prisma, args), {
            retry: (e) => {
              // Retry the transaction only if the error was due to a write conflict or deadlock
              // See: https://www.prisma.io/docs/reference/api-reference/error-reference#p2034
              return e.code === 'P2034'
            },
            ...options,
          })
        },
      } as {
        $transaction: typeof prisma.$transaction
      },
    }),
  )
}
