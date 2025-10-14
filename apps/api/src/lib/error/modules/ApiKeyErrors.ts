import { BaseError } from '../base'
import { ERROR_CODES } from '../types/types'

export class ApiKeyNotFoundError extends BaseError {
  constructor() {
    super(ERROR_CODES.API_KEY_NOT_FOUND)
  }
}

export class InvalidApiKeyFormatError extends BaseError {
  constructor() {
    super(ERROR_CODES.INVALID_API_KEY)
  }
}

export class ApiKeyRequiredError extends BaseError {
  constructor() {
    super(ERROR_CODES.API_KEY_REQUIRED)
  }
}

export class ApiKeyInactiveError extends BaseError {
  constructor() {
    super(ERROR_CODES.API_KEY_INACTIVE)
  }
}

export class StoreIdRequiredError extends BaseError {
  constructor() {
    super(ERROR_CODES.STORE_ID_REQUIRED)
  }
}

export class ApiKeyDeactivationFailedError extends BaseError {
  constructor() {
    super(ERROR_CODES.API_KEY_DEACTIVATION_FAILED)
  }
}
