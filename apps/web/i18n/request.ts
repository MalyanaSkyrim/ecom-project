import { localeEnum } from '@/lib/utils/locale.enum'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const locale = await requestLocale

  const parsedLocale = localeEnum.safeParse(locale)
  const validLocale = parsedLocale.success
    ? parsedLocale.data
    : routing.defaultLocale

  return {
    locale: validLocale,
    messages: (await import(`../locales/${locale}.json`)).default,
  }
})
