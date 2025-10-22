import { procedure, router } from '@/server/trpc'

import { getCategories } from './categories.handler'
import { categoriesQuerySchema } from './categories.schema'

const categoriesRouter = router({
  getCategories: procedure
    .input(categoriesQuerySchema)
    .query(({ input }) => getCategories(input)),
})

export default categoriesRouter
