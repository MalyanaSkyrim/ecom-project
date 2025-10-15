import type {
  CreateApiKeyInput,
  CreateProductInput,
  ProductListQuery,
  SigninInput,
  SignupInput,
  UpdateProductInput,
} from '@ecom/common'

import { FetchHttpClient } from '../../fetch/client'
import { apiSchema } from './schema'

// Create API client factory function
export function createApiClient(
  baseURL: string,
  headers?: Record<string, string>,
) {
  const client = FetchHttpClient.createClient({
    schema: apiSchema,
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  return {
    // Product API methods
    products: {
      // Get paginated list of products
      list: (query: ProductListQuery = { pageSize: 10, pageIndex: 0 }) =>
        client('@get/v1/products', { query }),

      // Create a new product
      create: (body: CreateProductInput) =>
        client('@post/v1/products', { body }),

      // Get a product by ID
      getById: (id: string) =>
        client('@get/v1/products/:id', { params: { id } }),

      // Update a product by ID
      update: (id: string, body: UpdateProductInput) =>
        client('@put/v1/products/:id', { params: { id }, body }),

      // Delete a product by ID
      delete: (id: string) =>
        client('@delete/v1/products/:id', { params: { id } }),
    },

    // Auth API methods
    auth: {
      // Sign in user
      signin: (body: SigninInput) => client('@post/v1/auth/signin', { body }),

      // Sign up user
      signup: (body: SignupInput) => client('@post/v1/auth/signup', { body }),
    },

    // API Key API methods
    apiKeys: {
      // Get all API keys for the current store
      list: () => client('@get/v1/api-keys'),

      // Create a new API key
      create: (body: CreateApiKeyInput) =>
        client('@post/v1/api-keys', { body }),

      // Deactivate an API key
      deactivate: (id: string) =>
        client('@put/v1/api-keys/:id/deactivate', { params: { id } }),
    },

    // Export the raw client for advanced usage
    rawClient: client,
  }
}

// Simple API client class with token management
export class ApiClient {
  private baseURL: string
  private token?: string
  private headers: Record<string, string>
  private client: ReturnType<typeof FetchHttpClient.createClient>

  constructor(
    baseURL: string,
    initialToken?: string,
    headers?: Record<string, string>,
  ) {
    this.baseURL = baseURL
    this.token = initialToken
    this.headers = headers || {}

    // Create the FetchHttpClient instance with schema (once)
    this.client = FetchHttpClient.createClient({
      schema: apiSchema,
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
      },
    })
  }

  // Token setter
  setToken(token: string | undefined) {
    this.token = token
  }

  // Headers setter
  setHeaders(headers: Record<string, string>) {
    this.headers = headers
  }

  // Add/update specific header
  setHeader(key: string, value: string) {
    this.headers[key] = value
  }

  // Get current token
  getToken() {
    return this.token
  }

  // Get current headers
  getHeaders() {
    return { ...this.headers }
  }

  // Helper to get headers with token for requests
  private getRequestHeaders() {
    return {
      ...this.headers,
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    }
  }

  // Product methods
  async getProducts(query: ProductListQuery = { pageSize: 10, pageIndex: 0 }) {
    return this.client('@get/v1/products', {
      query,
      headers: this.getRequestHeaders(),
    })
  }

  async createProduct(body: CreateProductInput) {
    return this.client('@post/v1/products', {
      body,
      headers: this.getRequestHeaders(),
    })
  }

  async getProductById(id: string) {
    return this.client('@get/v1/products/:id', {
      params: { id },
      headers: this.getRequestHeaders(),
    })
  }

  async updateProduct(id: string, body: UpdateProductInput) {
    return this.client('@put/v1/products/:id', {
      params: { id },
      body,
      headers: this.getRequestHeaders(),
    })
  }

  async deleteProduct(id: string) {
    return this.client('@delete/v1/products/:id', {
      params: { id },
      headers: this.getRequestHeaders(),
    })
  }

  // Auth methods
  async signin(body: SigninInput) {
    return this.client('@post/v1/auth/signin', { body })
  }

  async signup(body: SignupInput) {
    return this.client('@post/v1/auth/signup', { body })
  }

  // API Key methods
  async getApiKeys() {
    return this.client('@get/v1/api-keys', {
      headers: this.getRequestHeaders(),
    })
  }

  async createApiKey(body: CreateApiKeyInput) {
    return this.client('@post/v1/api-keys', {
      body,
      headers: this.getRequestHeaders(),
    })
  }

  async deactivateApiKey(id: string) {
    return this.client('@put/v1/api-keys/:id/deactivate', {
      params: { id },
      headers: this.getRequestHeaders(),
    })
  }
}
