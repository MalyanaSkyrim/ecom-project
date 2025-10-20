import { BaseError, BaseErrorOptions } from '../base'

export class CategoryNotFoundError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('CATEGORY_NOT_FOUND', options)
  }
}

export class CategoryCreationFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('CATEGORY_CREATION_FAILED', options)
  }
}

export class CategoryUpdateFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('CATEGORY_UPDATE_FAILED', options)
  }
}

export class CategoryDeletionFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('CATEGORY_DELETION_FAILED', options)
  }
}

export class InvalidCategoryDataError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('INVALID_CATEGORY_DATA', options)
  }
}
