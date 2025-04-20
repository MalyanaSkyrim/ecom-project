'use client'

import { TrpcProvider } from '@/lib/trpc/client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

import { Toaster } from '@ecom/ui'

export function Providers({ children }: { children: React.ReactNode }) {
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
          {children}
        </div>
      </NextThemesProvider>
    </TrpcProvider>
  )
}
