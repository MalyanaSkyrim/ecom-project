import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const fontIntegralCF = localFont({
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

export const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})
