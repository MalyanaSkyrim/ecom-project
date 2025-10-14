import { BaseError, BaseErrorOptions } from '../base'

export class ApiKeyNotFoundError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('API_KEY_NOT_FOUND', options)
  }
}

export class InvalidApiKeyFormatError extends BaseError {
  constructor() {
    super('INVALID_API_KEY')
  }
}

export class ApiKeyRequiredError extends BaseError {
  constructor() {
    super('API_KEY_REQUIRED')
  }
}

export class ApiKeyInactiveError extends BaseError {
  constructor() {
    super('API_KEY_INACTIVE')
  }
}

export class StoreIdRequiredError extends BaseError {
  constructor() {
    super('STORE_ID_REQUIRED')
  }
}

export class ApiKeyDeactivationFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('API_KEY_DEACTIVATION_FAILED', options)
  }
}
