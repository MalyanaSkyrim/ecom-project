'use client'

import BrowseByCategory from '@/components/BrowseByCategory'
import LandingSection from '@/components/Home/LandingSection'
import NewArrivals from '@/components/Home/NewArrivals'
import ReviewSection from '@/components/Home/ReviewSection'
import TopSelling from '@/components/Home/TopSelling'

export default function HomePage() {
  // const t = useTranslations()
  return (
    <div className="w-full">
      <LandingSection />
      <NewArrivals />

      <div className="separator"></div>

      <TopSelling />
      <BrowseByCategory />
      <ReviewSection />
    </div>
  )
}
