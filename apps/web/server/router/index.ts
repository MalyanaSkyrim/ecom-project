import { router } from '../trpc'
import authRouter from './auth/auth.router'

export const appRouter = router({
  auth: authRouter,
})

export type AppRouter = typeof appRouter
