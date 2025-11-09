import { procedure, router } from '@/server/trpc'

import { getCategories } from './categories.handler'
import {
  categoriesListReplySchema,
  categoriesQuerySchema,
} from './categories.schema'

const categoriesRouter = router({
  getCategories: procedure
    .input(categoriesQuerySchema)
    .output(categoriesListReplySchema)
    .query(({ input }) => getCategories(input)),
})

export default categoriesRouter
