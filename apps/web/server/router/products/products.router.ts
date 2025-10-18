import { procedure, router } from '@/server/trpc'

import { getNewArrivals, getTopSelling } from './products.handler'

const productsRouter = router({
  newArrivals: procedure.query(getNewArrivals),
  topSelling: procedure.query(getTopSelling),
})

export default productsRouter
