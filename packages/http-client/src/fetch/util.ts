import {
  BetterFetch,
  createFetch,
  CreateFetchOption,
  Schema,
} from '@better-fetch/fetch'

import { isValidHttpURL } from './helpers'
import { CreateBetterFetchOptions } from './types'

export function createBetterFetch<TSchema extends Schema = Schema>(
  options: CreateBetterFetchOptions<TSchema> = {},
): BetterFetch<{ schema: TSchema; throw: true }> {
  const { baseURL, schema, headers, ...restOptions } = options
  const fetchOptions = {
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    schema,
    throw: true,
    customFetchImpl: (url, options) => {
      const body = options?.body

      /**
       * This is a workaround to fix issue of body not being stringified
       * when the request is executed from NextJS app.
       */
      if (body && typeof body !== 'string') {
        const isPlainObject =
          body.constructor === Object ||
          (body.constructor === undefined && typeof body === 'object')

        if (isPlainObject) {
          options.body = JSON.stringify(body)
        }
      }

      const baseURL =
        options && 'baseURL' in options ? options.baseURL : undefined
      const validURL =
        baseURL && !isValidHttpURL(url.toString())
          ? baseURL + url.toString()
          : url

      return fetch(validURL, options)
    },
    ...restOptions,
  } satisfies CreateFetchOption

  return createFetch(fetchOptions as CreateFetchOption)
}
