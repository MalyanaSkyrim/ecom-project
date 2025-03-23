import { Providers } from '@/components/providers'
import SessionWrapper from '@/lib/auth/SessionWrapper'
import { fontIntegralCF, fontMono, fontSans } from '@/lib/fonts'
import '@ecom/ui/globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import React from 'react'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontIntegralCF.variable} flex min-h-screen flex-col bg-[#F2F0F1] font-sans antialiased`}>
        <SessionWrapper>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}

export default Layout
