import { procedure, router } from '@/server/trpc'

import { subscribeToNewsletter } from './newsletter.handler'
import {
  subscribeNewsletterInputSchema,
  subscribeNewsletterOutputSchema,
} from './newsletter.schema'

const newsletterRouter = router({
  subscribe: procedure
    .input(subscribeNewsletterInputSchema)
    .output(subscribeNewsletterOutputSchema)
    .mutation(({ input }) => subscribeToNewsletter(input)),
})

export default newsletterRouter
