import { BaseError } from '../base'

export class ValidationError extends BaseError {
  constructor(message: string, meta?: Record<string, unknown>) {
    super('VALIDATION_ERROR', {
      message,
      meta,
    })
  }
}
