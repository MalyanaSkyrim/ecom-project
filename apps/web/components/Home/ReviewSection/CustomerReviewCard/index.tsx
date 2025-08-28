import RatingStars from '@/components/RatingStars'
import { CheckCircle } from 'lucide-react'

export interface CustomerReview {
  id: string
  name: string
  verified: boolean
  rating: number
  review: string
}

const CustomerReviewCard: React.FC<{ review: CustomerReview }> = ({
  review,
}) => {
  return (
    <div className="rounded-[20px] border border-gray-200 bg-white px-9 py-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4">
        <RatingStars rating={review.rating} size={20} />
      </div>

      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-xl font-semibold text-gray-900">{review.name}</h3>
        {review.verified && <CheckCircle className="h-5 w-5 text-green-500" />}
      </div>

      <p className="line-clamp-4 overflow-hidden text-ellipsis leading-relaxed text-gray-700">
        {review.review}
      </p>
    </div>
  )
}

export default CustomerReviewCard
