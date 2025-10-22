import { router } from '../trpc'
import authRouter from './auth/auth.router'
import categoriesRouter from './categories/categories.router'
import newsletterRouter from './newsletter/newsletter.router'
import productsRouter from './products/products.router'
import reviewsRouter from './reviews/reviews.router'

export const appRouter = router({
  auth: authRouter,
  categories: categoriesRouter,
  newsletter: newsletterRouter,
  products: productsRouter,
  reviews: reviewsRouter,
})

export type AppRouter = typeof appRouter
