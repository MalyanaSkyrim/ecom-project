'use client'

import { TrpcProvider } from '@/lib/trpc/client'
import { useSession } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

import { Toaster } from '@ecom/ui'

import PageLoader from './PageLoader'

export function Providers({ children }: { children: React.ReactNode }) {
  const sessionData = useSession()
  const { status } = sessionData

  console.log('sky status:', status)

  return (
    <TrpcProvider>
      <NextThemesProvider
        forcedTheme="light"
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme>
        <div className="relative">
          <Toaster />
          {status === 'loading' ? <PageLoader /> : children}
        </div>
      </NextThemesProvider>
    </TrpcProvider>
  )
}
