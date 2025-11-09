import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { classMerge } from '@ecom/ui/lib/utils'

import { Button } from '../Button'

export interface CarouselProps {
  components: React.ReactNode[]
  className?: string
  slideClassName?: string
  slidesPerView?: number
  spaceBetween?: number
  loop?: boolean
  autoplay?: boolean
  showTopArrows?: boolean
  enableBlurEffect?: boolean
  breakpoints?: {
    [width: number]: {
      slidesPerView: number
      spaceBetween?: number
    }
  }
}

export const Carousel: React.FC<CarouselProps> = ({
  components,
  className = '',
  slideClassName = '',
  slidesPerView = 1,
  spaceBetween = 30,
  loop = true,
  autoplay = false,
  showTopArrows = false,
  enableBlurEffect = false,
  breakpoints,
}) => {
  const swiperModules = [Navigation]

  if (autoplay) swiperModules.push(Autoplay)

  return (
    <div className={`carousel-container space-y-5 ${className}`}>
      {showTopArrows && (
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            className="carousel-button-prev h-[25px] w-[25px] p-0.5">
            <ArrowLeft className="h-full w-full" />
          </Button>
          <Button
            variant="ghost"
            className="carousel-button-next h-[25px] w-[25px] p-0.5">
            <ArrowRight className="h-full w-full" />
          </Button>
        </div>
      )}
      <Swiper
        modules={swiperModules}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        centeredSlides={enableBlurEffect && slidesPerView >= 3 ? true : false}
        loop={loop}
        navigation={
          showTopArrows
            ? {
                nextEl: '.carousel-button-next',
                prevEl: '.carousel-button-prev',
              }
            : false
        }
        autoplay={
          autoplay ? { delay: 3000, disableOnInteraction: false } : false
        }
        breakpoints={breakpoints}
        className={classMerge(
          'carousel-swiper',
          enableBlurEffect && 'overflow-visible',
          slidesPerView >= 3 && 'w-[90%]',
        )}>
        {components.map((component, index) => (
          <SwiperSlide
            key={index}
            className={`carousel-slide flex justify-center ${slideClassName}`}>
            {({ isActive, isNext, isPrev }) => {
              if (!enableBlurEffect) return component

              const shouldBlur = !isActive && !isNext && !isPrev

              return shouldBlur ? (
                <div style={{ filter: 'blur(2px)' }}>{component}</div>
              ) : (
                <>{component}</>
              )
            }}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Carousel
