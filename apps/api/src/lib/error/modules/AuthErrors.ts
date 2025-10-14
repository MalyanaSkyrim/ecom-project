import { BaseError, BaseErrorOptions } from '../base'

export class UserNotFoundError extends BaseError {
  constructor() {
    super('USER_NOT_FOUND')
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('INVALID_CREDENTIALS', options)
  }
}

export class EmailAlreadyExistsError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('EMAIL_ALREADY_EXISTS', options)
  }
}

export class UserCreationFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('USER_CREATION_FAILED', options)
  }
}

export class PasswordTooWeakError extends BaseError {
  constructor() {
    super('PASSWORD_TOO_WEAK')
  }
}

export class InvalidEmailFormatError extends BaseError {
  constructor() {
    super('INVALID_EMAIL_FORMAT')
  }
}
