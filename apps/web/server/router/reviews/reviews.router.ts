import { procedure, router } from '@/server/trpc'

import { getStoreReviews } from './reviews.handler'
import { storeReviewsQuerySchema } from './reviews.schema'

const reviewsRouter = router({
  getStoreReviews: procedure
    .input(storeReviewsQuerySchema)
    .query(({ input }) => getStoreReviews(input)),
})

export default reviewsRouter
