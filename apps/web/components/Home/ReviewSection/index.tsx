import { Carousel } from '@ecom/ui'
import { useWindowSize } from '@ecom/ui/hooks'

import CustomerReviewCard, { CustomerReview } from './CustomerReviewCard'

const customerReviews: CustomerReview[] = [
  {
    id: 'review_001',
    name: 'Sarah M.',
    verified: true,
    rating: 5,
    review:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 'review_002',
    name: 'Alex K.',
    verified: true,
    rating: 5,
    review:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.',
  },
  {
    id: 'review_003',
    name: 'James L.',
    verified: true,
    rating: 5,
    review:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    id: 'review_004',
    name: 'Emma R.',
    verified: true,
    rating: 5,
    review:
      'The customer service at Shop.co is exceptional! When I had an issue with sizing, they quickly resolved it and even offered styling advice. The quality of their fabrics is outstanding too.',
  },
  {
    id: 'review_005',
    name: 'Michael D.',
    verified: true,
    rating: 4,
    review:
      'Shop.co has become my go-to for professional attire. Their business casual collection is impressive, and the fit is consistently perfect. Delivery is always prompt and packaging is eco-friendly.',
  },
  {
    id: 'review_006',
    name: 'Lisa T.',
    verified: true,
    rating: 5,
    review:
      "I've been shopping with Shop.co for over a year now, and they never disappoint. The seasonal collections are always fresh and exciting. Plus, their return policy is hassle-free, which gives me confidence in every purchase.",
  },
]

const ReviewSection = () => {
  const { width } = useWindowSize()

  const slidesPerView = width < 640 ? 1 : width < 1024 ? 2 : 3

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
