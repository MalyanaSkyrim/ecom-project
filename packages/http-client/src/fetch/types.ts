import {
  BetterFetch,
  BetterFetchError,
  BetterFetchOption,
  CreateFetchOption,
  Schema,
} from '@better-fetch/fetch'

export type CreateBetterFetchOptions<TSchema extends Schema = Schema> = Omit<
  CreateFetchOption,
  'throw' | 'customFetchImpl' | 'schema'
> & {
  schema?: TSchema
}

export type FetchInstance<TSchema extends Schema = Schema> = BetterFetch<{
  schema: TSchema
  throw: true
}>

export { BetterFetchError as FetchError }

export type FetchRequestOptions<
  TAdditionalOptions extends { [key: string]: unknown } = {
    [key: string]: unknown
  },
> = Omit<BetterFetchOption, 'body' | 'method' | 'baseURL' | 'throw'> & {
  includeBaseURL?: boolean
  includeHeaders?: boolean
} & TAdditionalOptions
