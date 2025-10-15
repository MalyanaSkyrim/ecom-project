import { z } from 'zod'

export const errorReplySchema = z.object({
  message: z.string(),
  code: z.string(),
  data: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    )
    .optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
})

export type ErrorReply = z.infer<typeof errorReplySchema>
