import { z } from 'zod'

import { paginationMetaSchema } from './paginationMeta'

export const paginationReplySchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: paginationMetaSchema,
  })

export type PaginationReply<T> = {
  data: T[]
  pagination: z.infer<typeof paginationMetaSchema>
}
