import currency from 'currency.js'
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
  const formattedPrice = currency(price, { fromCents: true }).format()
  return (
    <div className={classMerge('w-[295px] space-y-4', className)}>
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
        <h3 className="text-xl font-bold">{name}s</h3>
        <RatingStars rating={rating} showRating size={22} />
        <p className="text-2xl font-bold">{formattedPrice}</p>
      </div>
    </div>
  )
}

export default ProductCard
