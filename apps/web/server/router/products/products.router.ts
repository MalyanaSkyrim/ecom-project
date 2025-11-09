import { procedure, router } from '@/server/trpc'

import {
  getAllProducts,
  getNewArrivals,
  getTopSelling,
} from './products.handler'
import {
  productFiltersInputSchema,
  productListResponseSchema,
} from './products.schema'

const productsRouter = router({
  newArrivals: procedure.query(getNewArrivals),
  topSelling: procedure.query(getTopSelling),
  getAllProducts: procedure
    .input(productFiltersInputSchema)
    .output(productListResponseSchema)
    .query(({ input }) => getAllProducts(input)),
})

export default productsRouter
