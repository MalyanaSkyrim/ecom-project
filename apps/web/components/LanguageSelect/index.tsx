import useIntlLocale from '@/hooks/useIntlLocale'
import { locales } from '@/lib/utils/locale.enum'
import type { Locale } from '@/lib/utils/locale.enum'
import { useTranslations } from 'next-intl'

import { Select, type SelectOption } from '@ecom/ui'

const LanguageSelect = () => {
  const t = useTranslations()
  const { locale, changeLocale } = useIntlLocale()
  const localeOptions: (SelectOption & { id: Locale })[] = locales.map(
    (code) => ({
      id: code,
      label: t(code),
    }),
  )

  const isLocale = (value: string): value is Locale =>
    locales.some((availableLocale) => availableLocale === value)

  return (
    <Select
      options={localeOptions}
      default={locale}
      onSelect={(option) => {
        if (isLocale(option.id)) {
          changeLocale(option.id)
        }
      }}
    />
  )
}

export default LanguageSelect
