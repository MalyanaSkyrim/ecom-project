'use client'

import { usePathname } from '@/i18n/routing'
import { Locale } from '@/lib/utils/locale.enum'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

const useIntlLocale = () => {
  const pathname = usePathname()

  const router = useRouter()

  const currentLocale = useLocale()

  const changeLocale = (locale: Locale) => {
    router.push(`/${locale}${pathname}`)
  }

  return { locale: currentLocale as Locale, changeLocale }
}

export default useIntlLocale
