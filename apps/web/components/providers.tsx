'use client'

import { TrpcProvider } from '@/lib/trpc/client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TrpcProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme>
        {children}
      </NextThemesProvider>
    </TrpcProvider>
  )
}
