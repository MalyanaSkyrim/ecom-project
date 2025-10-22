export interface ErrorDefinition {
  message: string
  statusCode: number
}

// Error codes for API Key module
export const ERROR_CODES = [
  // API Key specific errors
  'API_KEY_NOT_FOUND',
  'INVALID_API_KEY',
  'API_KEY_REQUIRED',
  'API_KEY_INACTIVE',
  'STORE_ID_REQUIRED',
  'API_KEY_DEACTIVATION_FAILED',

  // Product errors
  'PRODUCT_NOT_FOUND',
  'PRODUCT_CREATION_FAILED',
  'PRODUCT_UPDATE_FAILED',
  'PRODUCT_DELETION_FAILED',
  'INVALID_PRODUCT_DATA',

  // Category errors
  'CATEGORY_NOT_FOUND',
  'CATEGORY_CREATION_FAILED',
  'CATEGORY_UPDATE_FAILED',
  'CATEGORY_DELETION_FAILED',
  'INVALID_CATEGORY_DATA',

  // Review errors
  'REVIEW_NOT_FOUND',
  'REVIEW_CREATION_FAILED',
  'REVIEW_UPDATE_FAILED',
  'REVIEW_DELETION_FAILED',
  'INVALID_REVIEW_DATA',

  // Newsletter errors
  'NEWSLETTER_SUBSCRIPTION_FAILED',

  // Authentication errors
  'USER_NOT_FOUND',
  'INVALID_CREDENTIALS',
  'EMAIL_ALREADY_EXISTS',
  'USER_CREATION_FAILED',
  'PASSWORD_TOO_WEAK',
  'INVALID_EMAIL_FORMAT',

  // Validation errors
  'VALIDATION_ERROR',
  'MISSING_REQUIRED_FIELD',
  'FIELD_TOO_SHORT',
  'FIELD_TOO_LONG',
  'INVALID_UUID_FORMAT',

  // Generic errors
  'INTERNAL_SERVER_ERROR',
] as const

export type ErrorCatalog = Partial<Record<ErrorCode, ErrorDefinition>>

export type ErrorCode = (typeof ERROR_CODES)[number]
