import { BaseError } from '../base'
import { ERROR_CODES } from '../types/types'

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(ERROR_CODES.VALIDATION_ERROR)
    // Override the message from the error catalog with the custom message
    Object.defineProperty(this, 'message', {
      value: message,
      writable: false,
    })
  }
}
