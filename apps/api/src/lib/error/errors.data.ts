import { ErrorCatalog } from './types/types'

export const ERROR_CATALOG: ErrorCatalog = {
  // API Key specific errors
  API_KEY_NOT_FOUND: {
    message: 'API key not found',
    statusCode: 404,
  },
  INVALID_API_KEY: {
    message: 'Invalid API key',
    statusCode: 401,
  },
  API_KEY_REQUIRED: {
    message:
      'API key is required. Please provide a valid API key in the Authorization header.',
    statusCode: 401,
  },
  API_KEY_INACTIVE: {
    message: 'API key is inactive',
    statusCode: 401,
  },
  STORE_ID_REQUIRED: {
    message: 'Store ID is required',
    statusCode: 400,
  },
  API_KEY_DEACTIVATION_FAILED: {
    message: 'Failed to deactivate API key',
    statusCode: 500,
  },

  // Product errors
  PRODUCT_NOT_FOUND: {
    message: 'Product not found',
    statusCode: 404,
  },
  PRODUCT_CREATION_FAILED: {
    message: 'Failed to create product',
    statusCode: 500,
  },
  PRODUCT_UPDATE_FAILED: {
    message: 'Failed to update product',
    statusCode: 500,
  },
  PRODUCT_DELETION_FAILED: {
    message: 'Failed to delete product',
    statusCode: 500,
  },
  INVALID_PRODUCT_DATA: {
    message: 'Invalid product data',
    statusCode: 400,
  },

  // Category errors
  CATEGORY_NOT_FOUND: {
    message: 'Category not found',
    statusCode: 404,
  },
  CATEGORY_CREATION_FAILED: {
    message: 'Failed to create category',
    statusCode: 500,
  },
  CATEGORY_UPDATE_FAILED: {
    message: 'Failed to update category',
    statusCode: 500,
  },
  CATEGORY_DELETION_FAILED: {
    message: 'Failed to delete category',
    statusCode: 500,
  },
  INVALID_CATEGORY_DATA: {
    message: 'Invalid category data',
    statusCode: 400,
  },

  // Review errors
  REVIEW_NOT_FOUND: {
    message: 'Review not found',
    statusCode: 404,
  },
  REVIEW_CREATION_FAILED: {
    message: 'Failed to create review',
    statusCode: 500,
  },
  REVIEW_UPDATE_FAILED: {
    message: 'Failed to update review',
    statusCode: 500,
  },
  REVIEW_DELETION_FAILED: {
    message: 'Failed to delete review',
    statusCode: 500,
  },
  INVALID_REVIEW_DATA: {
    message: 'Invalid review data',
    statusCode: 400,
  },

  // Newsletter errors
  NEWSLETTER_SUBSCRIPTION_FAILED: {
    message: 'Failed to subscribe to newsletter',
    statusCode: 500,
  },

  // Authentication errors
  USER_NOT_FOUND: {
    message: 'User not found',
    statusCode: 404,
  },
  INVALID_CREDENTIALS: {
    message: 'Invalid credentials',
    statusCode: 401,
  },
  EMAIL_ALREADY_EXISTS: {
    message: 'Email already exists',
    statusCode: 409,
  },
  USER_CREATION_FAILED: {
    message: 'Failed to create user',
    statusCode: 500,
  },
  PASSWORD_TOO_WEAK: {
    message: 'Password is too weak',
    statusCode: 400,
  },
  INVALID_EMAIL_FORMAT: {
    message: 'Invalid email format',
    statusCode: 400,
  },

  // Validation errors
  VALIDATION_ERROR: {
    message: 'Validation error',
    statusCode: 400,
  },
  MISSING_REQUIRED_FIELD: {
    message: 'Required field is missing',
    statusCode: 400,
  },
  FIELD_TOO_SHORT: {
    message: 'Field is too short',
    statusCode: 400,
  },
  FIELD_TOO_LONG: {
    message: 'Field is too long',
    statusCode: 400,
  },
  INVALID_UUID_FORMAT: {
    message: 'Invalid UUID format',
    statusCode: 400,
  },

  // Generic errors
  INTERNAL_SERVER_ERROR: {
    message: 'Internal server error',
    statusCode: 500,
  },
}
