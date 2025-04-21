'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const PageLoader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex items-center -space-x-12">
        <DotLottieReact
          src="./lotties/shopping-cart-loading.lottie"
          loop
          autoplay
          className="w-[240px]"
        />
        <p className="text-4xl font-extrabold">SHOP.CO</p>
      </div>
    </div>
  )
}

export default PageLoader
