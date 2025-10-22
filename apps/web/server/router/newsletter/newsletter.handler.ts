import { env } from '@/env'

import { ApiClient } from '@ecom/http-client'

import type {
  SubscribeNewsletterInput,
  SubscribeNewsletterOutput,
} from './newsletter.schema'

const apiClient = new ApiClient(env.API_URL, env.API_KEY)

export const subscribeToNewsletter = async (
  input: SubscribeNewsletterInput,
): Promise<SubscribeNewsletterOutput> => {
  try {
    const result = await apiClient.subscribeToNewsletter(input)
    return result
  } catch (error: unknown) {
    console.error('Failed to subscribe to newsletter:', error)
    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error as {
        response?: { body?: { message?: string } }
      }
      if (responseError?.response?.body?.message) {
        throw new Error(responseError.response.body.message)
      }
    }
    throw error
  }
}
