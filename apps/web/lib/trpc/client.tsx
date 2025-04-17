'use client'

import { AppRouter } from '@/server/router'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'
import SuperJSON from 'superjson'

import { httpBatchLink, loggerLink, TRPCClientError } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'

import { createQueryClient } from './query-client'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3002' // dev SSR should use localhost
  return 'http://host.docker.internal:8080' // else use docker host
}

const handleClientUnauthorizedErrors = (error: unknown): boolean => {
  if (typeof window === 'undefined') return false
  if (!(error instanceof TRPCClientError)) return false
  if (error.data?.code !== 'UNAUTHORIZED') return false

  window.history.pushState({}, '', '/login')

  return true
}

let clientQueryClientSingleton: QueryClient

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

export const trpc = createTRPCReact<AppRouter>()

export function TrpcProvider(props: { children: ReactNode }) {
  const queryClient = getQueryClient()
  queryClient.setDefaultOptions({
    queries: {
      retry: (failureCount, error) => {
        if (handleClientUnauthorizedErrors(error)) return false
        return failureCount < 3
      },
    },
    mutations: {
      retry: (_, error) => {
        handleClientUnauthorizedErrors(error)
        return false
      },
    },
  })

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
