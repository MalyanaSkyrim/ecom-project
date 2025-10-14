import { BaseError } from '../base'
import { ERROR_CODES } from '../types/types'

export class ProductNotFoundError extends BaseError {
  constructor() {
    super(ERROR_CODES.PRODUCT_NOT_FOUND)
  }
}

export class ProductCreationFailedError extends BaseError {
  constructor() {
    super(ERROR_CODES.PRODUCT_CREATION_FAILED)
  }
}

export class ProductUpdateFailedError extends BaseError {
  constructor() {
    super(ERROR_CODES.PRODUCT_UPDATE_FAILED)
  }
}

export class ProductDeletionFailedError extends BaseError {
  constructor() {
    super(ERROR_CODES.PRODUCT_DELETION_FAILED)
  }
}

export class InvalidProductDataError extends BaseError {
  constructor() {
    super(ERROR_CODES.INVALID_PRODUCT_DATA)
  }
}
