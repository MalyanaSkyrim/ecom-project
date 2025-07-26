import React from 'react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export interface CarouselProps {
  components: React.ReactNode[]
  className?: string
  slideClassName?: string
  slidesPerView?: number
  spaceBetween?: number
  loop?: boolean
  autoplay?: boolean
  navigation?: boolean
  pagination?: boolean
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
  navigation = true,
  pagination = true,
  breakpoints,
}) => {
  const swiperModules = []

  if (navigation) swiperModules.push(Navigation)
  if (pagination) swiperModules.push(Pagination)
  if (autoplay) swiperModules.push(Autoplay)

  return (
    <div className={`carousel-container ${className}`}>
      <Swiper
        modules={swiperModules}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        loop={loop}
        navigation={navigation}
        autoplay={
          autoplay ? { delay: 3000, disableOnInteraction: false } : false
        }
        breakpoints={breakpoints}
        className="carousel-swiper">
        {components.map((component, index) => (
          <SwiperSlide
            key={index}
            className={`carousel-slide flex justify-center ${slideClassName}`}>
            {component}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Carousel
