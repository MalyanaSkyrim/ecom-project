import NavBar from '@/components/NavBar'
import { Providers } from '@/components/providers'
import { routing } from '@/i18n/routing'
import '@ecom/ui/globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { notFound } from 'next/navigation'

const fontIntegralCF = localFont({
  src: [
    {
      path: '../fonts/integralCF/integralcf-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/integralCF/integralcf-regularoblique.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/integralCF/integralcf-medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/integralCF/integralcf-mediumoblique.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../fonts/integralCF/integralcf-demibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/integralCF/integralcf-demiboldoblique.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../fonts/integralCF/integralcf-bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/integralCF/integralcf-boldoblique.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../fonts/integralCF/integralcf-extrabold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../fonts/integralCF/integralcf-extraboldoblique.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../fonts/integralCF/integralcf-heavy.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/integralCF/integralcf-heavyoblique.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-integral-cf',
})

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontIntegralCF.variable} bg-[#F2F0F1] font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
