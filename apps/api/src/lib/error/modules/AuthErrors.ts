import { BaseError } from '../base'
import { ERROR_CODES } from '../types/types'

export class UserNotFoundError extends BaseError {
  constructor() {
    super(ERROR_CODES.USER_NOT_FOUND)
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super(ERROR_CODES.INVALID_CREDENTIALS)
  }
}

export class EmailAlreadyExistsError extends BaseError {
  constructor() {
    super(ERROR_CODES.EMAIL_ALREADY_EXISTS)
  }
}

export class UserCreationFailedError extends BaseError {
  constructor() {
    super(ERROR_CODES.USER_CREATION_FAILED)
  }
}

export class PasswordTooWeakError extends BaseError {
  constructor() {
    super(ERROR_CODES.PASSWORD_TOO_WEAK)
  }
}

export class InvalidEmailFormatError extends BaseError {
  constructor() {
    super(ERROR_CODES.INVALID_EMAIL_FORMAT)
  }
}
