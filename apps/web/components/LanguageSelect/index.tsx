import useIntlLocale from '@/hooks/useIntlLocale'
import { locales } from '@/lib/utils/locale.enum'
import { useTranslations } from 'next-intl'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/ui'

const LanguageSelect = () => {
  const t = useTranslations()
  const { locale, changeLocale } = useIntlLocale()
  const localeOptions = locales.map((locale) => ({
    value: locale,
    label: t(locale),
  }))

  return (
    <Select defaultValue={locale} onValueChange={changeLocale}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {localeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LanguageSelect
