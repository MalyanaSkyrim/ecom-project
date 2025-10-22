'use client'

import { trpc } from '@/lib/trpc/client'

import { Carousel } from '@ecom/ui'
import { useWindowSize } from '@ecom/ui/hooks'

import CustomerReviewCard, { CustomerReview } from './CustomerReviewCard'
import CustomerReviewCardSkeleton from './CustomerReviewCard/CustomerReviewCardSkeleton'

const ReviewSection = () => {
  const { data: apiReviews, isLoading } = trpc.reviews.getStoreReviews.useQuery(
    {
      pageSize: 6,
      pageIndex: 0,
      sorting: [{ id: 'createdAt', direction: 'desc' }],
    },
  )

  const { width } = useWindowSize()
  const slidesPerView = width < 640 ? 1 : width < 1024 ? 2 : 3

  if (isLoading) {
    return (
      <div className="section_container xs:space-y-9 space-y-6">
        <h1 className="section_title">Our happy customers</h1>
        <Carousel
          components={Array.from({ length: 3 }).map((_, index) => (
            <CustomerReviewCardSkeleton key={index} />
          ))}
          slidesPerView={slidesPerView}
          showTopArrows={true}
          spaceBetween={20}
          enableBlurEffect
        />
      </div>
    )
  }

  // Transform API data to match CustomerReview interface
  const customerReviews: CustomerReview[] =
    apiReviews?.data.map((review) => ({
      id: review.id,
      name: `Customer ${review.customerId.slice(-4)}`, // Use last 4 chars of customerId as name
      verified: true, // Assume all reviews are verified
      rating: review.rating,
      review: review.content,
    })) || []

  // Don't render the section if there are no reviews
  if (!customerReviews.length) {
    return null
  }

  return (
    <div className="section_container xs:space-y-9 space-y-6">
      <h1 className="section_title">Our happy customers</h1>
      <Carousel
        components={customerReviews.map((review) => (
          <CustomerReviewCard key={review.id} review={review} />
        ))}
        slidesPerView={slidesPerView}
        showTopArrows={true}
        spaceBetween={20}
        enableBlurEffect
      />
    </div>
  )
}

export default ReviewSection
