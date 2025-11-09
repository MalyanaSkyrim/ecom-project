'use client'

import { TrpcProvider } from '@/lib/trpc/client'
import { useSession } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import * as React from 'react'

import { Toaster } from '@ecom/ui'

import PageLoader from './PageLoader'

export function Providers({ children }: { children: React.ReactNode }) {
  const sessionData = useSession()
  const { status } = sessionData

  return (
    <TrpcProvider>
      <NuqsAdapter>
        <NextThemesProvider
          forcedTheme="light"
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme>
          <div className="relative overflow-hidden">
            <Toaster />
            {status === 'loading' ? <PageLoader /> : children}
          </div>
        </NextThemesProvider>
      </NuqsAdapter>
    </TrpcProvider>
  )
}
