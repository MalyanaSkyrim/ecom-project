import { formatPrice } from '@/lib/utils/currency'
import type { Locale } from '@/lib/utils/locale.enum'
import { useLocale } from 'next-intl'
import Image from 'next/image'

import { classMerge } from '@ecom/ui/lib/utils'

import RatingStars from '../RatingStars'

interface ProductCardProps {
  name: string
  rating: number
  price: number // cents
  imageUrl: string
  className?: string
}

const ProductCard = ({
  name,
  rating,
  price,
  imageUrl,
  className,
}: ProductCardProps) => {
  const locale = useLocale() as Locale
  const formattedPrice = formatPrice(price, locale)
  return (
    <div className={classMerge('space-y-4', className)}>
      <div className="aspect-[0.98] w-full overflow-hidden rounded-[20px] bg-[#F0EEED]">
        <Image
          src={imageUrl}
          alt={name}
          width={300}
          height={300}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold 2xl:text-xl">{name}s</h3>
        <RatingStars rating={rating} showRating size={22} />
        <p className="text-xl font-bold 2xl:text-2xl">{formattedPrice}</p>
      </div>
    </div>
  )
}

export default ProductCard
