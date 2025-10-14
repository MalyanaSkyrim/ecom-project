import { ERROR_CODES, ErrorCatalog } from './types/types'

export const ERROR_CATALOG: ErrorCatalog = {
  // API Key specific errors
  [ERROR_CODES.API_KEY_NOT_FOUND]: {
    message: 'API key not found',
    statusCode: 404,
  },
  [ERROR_CODES.INVALID_API_KEY]: {
    message: 'Invalid API key',
    statusCode: 401,
  },
  [ERROR_CODES.API_KEY_REQUIRED]: {
    message:
      'API key is required. Please provide a valid API key in the Authorization header.',
    statusCode: 401,
  },
  [ERROR_CODES.API_KEY_INACTIVE]: {
    message: 'API key is inactive',
    statusCode: 401,
  },
  [ERROR_CODES.STORE_ID_REQUIRED]: {
    message: 'Store ID is required',
    statusCode: 400,
  },
  [ERROR_CODES.API_KEY_DEACTIVATION_FAILED]: {
    message: 'Failed to deactivate API key',
    statusCode: 500,
  },

  // Product errors
  [ERROR_CODES.PRODUCT_NOT_FOUND]: {
    message: 'Product not found',
    statusCode: 404,
  },
  [ERROR_CODES.PRODUCT_CREATION_FAILED]: {
    message: 'Failed to create product',
    statusCode: 500,
  },
  [ERROR_CODES.PRODUCT_UPDATE_FAILED]: {
    message: 'Failed to update product',
    statusCode: 500,
  },
  [ERROR_CODES.PRODUCT_DELETION_FAILED]: {
    message: 'Failed to delete product',
    statusCode: 500,
  },
  [ERROR_CODES.INVALID_PRODUCT_DATA]: {
    message: 'Invalid product data',
    statusCode: 400,
  },

  // Authentication errors
  [ERROR_CODES.USER_NOT_FOUND]: {
    message: 'User not found',
    statusCode: 404,
  },
  [ERROR_CODES.INVALID_CREDENTIALS]: {
    message: 'Invalid credentials',
    statusCode: 401,
  },
  [ERROR_CODES.EMAIL_ALREADY_EXISTS]: {
    message: 'Email already exists',
    statusCode: 409,
  },
  [ERROR_CODES.USER_CREATION_FAILED]: {
    message: 'Failed to create user',
    statusCode: 500,
  },
  [ERROR_CODES.PASSWORD_TOO_WEAK]: {
    message: 'Password is too weak',
    statusCode: 400,
  },
  [ERROR_CODES.INVALID_EMAIL_FORMAT]: {
    message: 'Invalid email format',
    statusCode: 400,
  },

  // Validation errors
  [ERROR_CODES.VALIDATION_ERROR]: {
    message: 'Validation error',
    statusCode: 400,
  },
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: {
    message: 'Required field is missing',
    statusCode: 400,
  },
  [ERROR_CODES.FIELD_TOO_SHORT]: {
    message: 'Field is too short',
    statusCode: 400,
  },
  [ERROR_CODES.FIELD_TOO_LONG]: {
    message: 'Field is too long',
    statusCode: 400,
  },
  [ERROR_CODES.INVALID_UUID_FORMAT]: {
    message: 'Invalid UUID format',
    statusCode: 400,
  },

  // Generic errors
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    message: 'Internal server error',
    statusCode: 500,
  },
}
