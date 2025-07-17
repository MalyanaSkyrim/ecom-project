import Image from 'next/image'

import { Button } from '@ecom/ui'

import FeaturedBrands from './FeaturedBrands'
import StatsBanner from './StatsBanner'

const LandingSection = () => {
  return (
    <div className="relative flex h-[calc(100vh-80px)] w-full flex-col overflow-hidden bg-[#F2F0F1] px-5 py-6 md:p-10 lg:flex-row lg:px-20 lg:py-0">
      <div className="space-y-8 lg:mt-20">
        <div className="space-y-5 lg:space-y-8">
          <h1 className="font-integralCF max-w-[400px] text-4xl font-bold sm:max-w-[500px] sm:text-5xl lg:max-w-[600px] lg:text-6xl">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="max-w-[600px]">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <Button className="h-12 w-44 rounded-full">Shop Now</Button>
        </div>
        <StatsBanner />
      </div>
      <div className="flex flex-1 items-start justify-end self-end object-cover lg:self-auto">
        <Image
          className="w-[90%] object-cover object-top"
          src={'/img/landing_image.jpg'}
          width={500}
          height={700}
          alt="Man and woman wearing stylish clothes"
        />
      </div>
      <FeaturedBrands />
    </div>
  )
}

export default LandingSection
