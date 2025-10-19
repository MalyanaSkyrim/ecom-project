import { router } from '../trpc'
import authRouter from './auth/auth.router'
import productsRouter from './products/products.router'

export const appRouter = router({
  auth: authRouter,
  products: productsRouter,
})

export type AppRouter = typeof appRouter
