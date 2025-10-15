import { createSchema } from '@better-fetch/fetch'
import z from 'zod'

export const apiPaymentSchema = createSchema(
  {
    '@get/v1/products': {
      query: z.object({}), // we should use query schema from api,
      output: z.object({}), // we should use response schema from api,
    },
    '@get/v1/products/:id': {
      params: z.object({
        // we should use params schema from api,
        id: z.uuid(),
      }),
      output: z.object({}), // we should use response schema from api,
    },
  },
  {
    strict: true,
  },
)
