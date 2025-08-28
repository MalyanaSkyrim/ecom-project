import { Star } from 'lucide-react'
import React from 'react'

interface RatingStarsProps {
  rating: number
  size?: number
  showRating?: boolean
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 24,
  showRating,
}) => {
  // Clamp rating between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, rating))

  // Calculate the width percentage for the filled stars
  const fillPercentage = (clampedRating / 5) * 100

  return (
    <div className="flex items-center gap-4">
      <div className="relative inline-flex">
        {/* Background stars (empty/outline) */}
        <div className="flex space-x-[5px]">
          {[...Array(5)].map((_, index) => (
            <Star
              key={`empty-${index}`}
              size={size}
              className="text-gray-300"
              fill="none"
              stroke="currentColor"
            />
          ))}
        </div>

        {/* Filled stars overlay */}
        <div
          className="absolute left-0 top-0 flex space-x-[5px] overflow-hidden"
          style={{ width: `${fillPercentage}%` }}>
          {[...Array(5)].map((_, index) => (
            <Star
              key={`filled-${index}`}
              size={size}
              className="flex-shrink-0 text-[#FFC633]"
              fill="currentColor"
              stroke="currentColor"
            />
          ))}
        </div>
      </div>

      {showRating && (
        <span
          className="font-medium text-gray-700"
          style={{ fontSize: size * 0.8 }}>
          {clampedRating.toFixed(1)}/5
        </span>
      )}
    </div>
  )
}

export default RatingStars
