import { procedure, router } from '@/server/trpc'

import { getNewArrivals } from './products.handler'

const productsRouter = router({
  newArrivals: procedure.query(getNewArrivals),
})

export default productsRouter
