import type { BetterFetchPlugin } from '@better-fetch/fetch'
import qs from 'qs'

export const querySerializerPlugin: BetterFetchPlugin = {
  id: 'query-serializer',
  name: 'Query Serializer',
  description:
    'Serializes query parameters using qs library with indices format',
  init: (url, options) => {
    if (options?.query) {
      const queryString = qs.stringify(options.query, {
        arrayFormat: 'indices',
        skipNulls: true,
      })

      if (queryString) {
        const separator = url.includes('?') ? '&' : '?'
        url = `${url}${separator}${queryString}`
      }

      // Remove query to prevent better-fetch from processing it
      delete options.query
    }

    return { url, options }
  },
}
