import { BetterFetchOption, Schema } from '@better-fetch/fetch'

import { CreateBetterFetchOptions, FetchRequestOptions } from './types'
import { createBetterFetch } from './util'

export class FetchHttpClient {
  protected static baseURL: string
  protected static headers: CreateBetterFetchOptions['headers']
  protected static client = createBetterFetch()

  static setBaseURL(url: string) {
    this.baseURL = url
  }

  static setHeaders(headers: CreateBetterFetchOptions['headers']) {
    this.headers = headers
  }

  static createClient<TSchema extends Schema>(
    options: CreateBetterFetchOptions<TSchema>,
  ): ReturnType<typeof createBetterFetch<TSchema>> {
    return createBetterFetch(options)
  }

  private static async makeRequest<TResponse>({
    endpoint,
    method,
    options,
    body,
  }: {
    endpoint: string
    method: BetterFetchOption['method']
    options?: FetchRequestOptions
    body?: BetterFetchOption['body']
  }) {
    const includeBaseURL = options?.includeBaseURL ?? true
    const includeHeaders = options?.includeHeaders ?? true

    return this.client<TResponse>(endpoint, {
      method,
      ...options,
      baseURL: includeBaseURL ? this.baseURL : undefined,
      headers: includeHeaders
        ? { ...this.headers, ...(options ? options.headers : {}) }
        : undefined,
      body,
    })
  }

  static post<
    TBody,
    TResponse = unknown,
    TAdditionalOptions extends { [key: string]: unknown } = {},
  >(
    endpoint: string,
    body: TBody,
    options?: FetchRequestOptions<TAdditionalOptions>,
  ) {
    return this.makeRequest<TResponse>({
      endpoint,
      method: 'POST',
      body,
      options,
    })
  }

  static get<
    TResponse,
    TAdditionalOptions extends { [key: string]: unknown } = {},
  >(endpoint: string, options?: FetchRequestOptions<TAdditionalOptions>) {
    return this.makeRequest<TResponse>({ endpoint, method: 'GET', options })
  }

  static put<
    TBody,
    TResponse,
    TAdditionalOptions extends { [key: string]: unknown } = {},
  >(
    endpoint: string,
    body: TBody,
    options?: FetchRequestOptions<TAdditionalOptions>,
  ) {
    return this.makeRequest<TResponse>({
      endpoint,
      method: 'PUT',
      body,
      options,
    })
  }

  static delete<
    TResponse,
    TAdditionalOptions extends { [key: string]: unknown } = {},
  >(endpoint: string, options?: FetchRequestOptions<TAdditionalOptions>) {
    return this.makeRequest<TResponse>({ endpoint, method: 'DELETE', options })
  }

  static patch<
    TBody,
    TResponse,
    TAdditionalOptions extends { [key: string]: unknown } = {},
  >(
    endpoint: string,
    body: TBody,
    options?: FetchRequestOptions<TAdditionalOptions>,
  ) {
    return this.makeRequest<TResponse>({
      endpoint,
      method: 'PATCH',
      body,
      options,
    })
  }
}
