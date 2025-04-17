import { AppRouter } from '@/server/router'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export type AppRouterInputTypes = inferRouterInputs<AppRouter>
export type AppRouterOutputTypes = inferRouterOutputs<AppRouter>
