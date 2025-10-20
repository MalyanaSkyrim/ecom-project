import { BaseError, BaseErrorOptions } from '../base'

export class ReviewNotFoundError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('REVIEW_NOT_FOUND', options)
  }
}

export class ReviewCreationFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('REVIEW_CREATION_FAILED', options)
  }
}

export class ReviewUpdateFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('REVIEW_UPDATE_FAILED', options)
  }
}

export class ReviewDeletionFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('REVIEW_DELETION_FAILED', options)
  }
}

export class InvalidReviewDataError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('INVALID_REVIEW_DATA', options)
  }
}
