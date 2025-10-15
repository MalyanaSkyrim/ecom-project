import { z } from 'zod'

import { errorReplySchema as commonErrorReplySchema } from '@ecom/common'

import { ERROR_CODES } from './types/types'

/**
 * Unified error response schema for all endpoints
 * This ensures consistent error format across the entire API
 */
export const errorReplySchema = commonErrorReplySchema.extend({
  code: z.enum(ERROR_CODES),
})

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
