import { ERROR_CATALOG } from './errors.data'
import type { ErrorCode } from './types/types'

export interface BaseErrorOptions {
  message?: string
  meta?: Record<string, unknown>
}

export abstract class BaseError extends Error {
  readonly code: ErrorCode
  readonly meta: Record<string, unknown>

  get statusCode(): number {
    const errorDef = ERROR_CATALOG[this.code]
    if (!errorDef) {
      throw new Error(`No error definition found for code: ${this.code}`)
    }
    return errorDef.statusCode
  }

  constructor(code: ErrorCode, options?: BaseErrorOptions) {
    const errorDef = ERROR_CATALOG[code]
    if (!errorDef) {
      throw new Error(`No error definition found for code: ${code}`)
    }

    // Use custom message if provided, otherwise use default from catalog
    const message = options?.message || errorDef.message

    super(message)
    this.name = this.constructor.name
    this.code = code
    this.meta = options?.meta || {}

    // Maintains the error stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
