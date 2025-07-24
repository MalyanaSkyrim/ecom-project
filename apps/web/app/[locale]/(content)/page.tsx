'use client'

import LandingSection from '@/components/Home/LandingSection'
import NewArrivals from '@/components/Home/NewArrivals'

export default function HomePage() {
  // const t = useTranslations()
  return (
    <div className="w-full">
      <LandingSection />
      <NewArrivals />
    </div>
  )
}
