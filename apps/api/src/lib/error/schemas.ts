import { z } from 'zod'

import { ERROR_CODES } from './types/types'

/**
 * Unified error response schema for all endpoints
 * This ensures consistent error format across the entire API
 */
export const errorReplySchema = z
  .object({
    message: z.string(),
    code: z.enum(ERROR_CODES),
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
  .meta({ description: 'Standard error response format' })

/**
 * Example error response for documentation
 */
export const errorReplyExample = {
  message: 'Validation error',
  code: 'VALIDATION_ERROR',
  data: [
    {
      field: 'querystring/pageSize',
      message: 'must be <= 100',
    },
  ],
} as const

export type ErrorReply = z.infer<typeof errorReplySchema>
