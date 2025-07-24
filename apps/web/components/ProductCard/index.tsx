import currency from 'currency.js'
import Image from 'next/image'

import RatingStars from '../RatingStars'

interface ProductCardProps {
  name: string
  rating: number
  price: number // cents
  imageUrl: string
}

const ProductCard = ({ name, rating, price, imageUrl }: ProductCardProps) => {
  const formattedPrice = currency(price, { fromCents: true }).format()
  return (
    <div className="space-y-4">
      <div className="h-[298px] w-[295px] overflow-hidden rounded-[20px] bg-[#F0EEED]">
        <Image src={imageUrl} alt={name} width={300} height={300} />
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
