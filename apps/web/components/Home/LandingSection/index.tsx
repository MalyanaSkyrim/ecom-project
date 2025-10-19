import Image from 'next/image'

import { Button } from '@ecom/ui'
import { useWindowSize } from '@ecom/ui/hooks'

import FeaturedBrands from './FeaturedBrands'
import StatsBanner from './StatsBanner'

const LandingSection = () => {
  const { width, height } = useWindowSize()
  const ratio = Math.max(height / width)
  console.log('sky', { ratio })

  return (
    <div className="relative flex h-[calc(100vh-80px)] w-full flex-col justify-between overflow-hidden bg-[#F2F0F1] px-5 py-6 md:px-8 md:py-9 lg:p-10 xl:px-20 xl:py-0 landscape:flex-row">
      <div className="space-y-8 xl:mt-20">
        <div className="space-y-5 lg:space-y-8">
          <h1 className="font-integralCF max-w-[400px] text-4xl font-bold sm:max-w-[500px] sm:text-5xl lg:max-w-[600px] lg:text-6xl">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="max-w-[600px]">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <Button className="h-12 w-44 rounded-full text-base">Shop Now</Button>
        </div>
        <StatsBanner />
      </div>
      <div className="2xs:flex hidden min-w-[400px] flex-1 justify-end object-top xl:max-w-[600px]">
        {(ratio > 2 || width >= 768) && (
          <Image
            className="object-cover object-top portrait:h-[90%] landscape:w-[90%]"
            src={'/img/landing_image.png'}
            width={500}
            height={700}
            alt="Man and woman wearing stylish clothes"
          />
        )}
      </div>
      <FeaturedBrands />
    </div>
  )
}

export default LandingSection
