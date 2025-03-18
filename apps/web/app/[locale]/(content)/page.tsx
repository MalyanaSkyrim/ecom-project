'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('HomePage')
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-2">
      <div>
        <h1>{t('title')}</h1>
        <Link href="/about">{t('about')}</Link>
      </div>
    </div>
  )
}
