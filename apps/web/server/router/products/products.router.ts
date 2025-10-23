import { procedure, router } from '@/server/trpc'

import {
  getAllProducts,
  getNewArrivals,
  getTopSelling,
} from './products.handler'

const productsRouter = router({
  newArrivals: procedure.query(getNewArrivals),
  topSelling: procedure.query(getTopSelling),
  getAllProducts: procedure.query(getAllProducts),
})

export default productsRouter
