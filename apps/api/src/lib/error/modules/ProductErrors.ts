import { BaseError, BaseErrorOptions } from '../base'

export class ProductNotFoundError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('PRODUCT_NOT_FOUND', options)
  }
}

export class ProductCreationFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('PRODUCT_CREATION_FAILED', options)
  }
}

export class ProductUpdateFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('PRODUCT_UPDATE_FAILED', options)
  }
}

export class ProductDeletionFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('PRODUCT_DELETION_FAILED', options)
  }
}

export class InvalidProductDataError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('INVALID_PRODUCT_DATA', options)
  }
}
