import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const fontIntegralCF = localFont({
  src: [
    {
      path: './IntegralCF/integralcf-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './IntegralCF/integralcf-regularoblique.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './IntegralCF/integralcf-medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './IntegralCF/integralcf-mediumoblique.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './IntegralCF/integralcf-demibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './IntegralCF/integralcf-demiboldoblique.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './IntegralCF/integralcf-bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './IntegralCF/integralcf-boldoblique.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './IntegralCF/integralcf-extrabold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './IntegralCF/integralcf-extraboldoblique.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: './IntegralCF/integralcf-heavy.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './IntegralCF/integralcf-heavyoblique.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-integral-cf',
})

export const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})
