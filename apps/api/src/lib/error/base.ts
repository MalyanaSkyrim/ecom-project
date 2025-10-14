import { ERROR_CATALOG } from './errors.data'

export abstract class BaseError extends Error {
  readonly code: string

  get statusCode(): number {
    return ERROR_CATALOG[this.code].statusCode
  }

  constructor(code: string) {
    const errorDef = ERROR_CATALOG[code]
    super(errorDef.message)
    this.name = this.constructor.name
    this.code = code

    // Maintains the error stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
