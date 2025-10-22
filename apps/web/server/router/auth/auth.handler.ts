import { env } from '@/env'
import { SignUpData } from '@/lib/validation/auth'

import type { SigninInput, SignupInput } from '@ecom/common'
import { ApiClient } from '@ecom/http-client'

// Create API client instance with API key for store-specific authentication
const apiClient = new ApiClient(env.API_URL, undefined, {
  Authorization: `Bearer ${env.API_KEY}`,
})

export const signUp = async ({
  input,
}: {
  input: Omit<SignUpData, 'confirmPassword'>
}) => {
  try {
    // Convert to SignupInput type
    const signupData: SignupInput = {
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
    }

    const result = await apiClient.signup(signupData)
    return result
  } catch (error: unknown) {
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

export const signIn = async ({
  input,
}: {
  input: { email: string; password: string }
}) => {
  try {
    const signinData: SigninInput = {
      email: input.email,
      password: input.password,
    }

    const result = await apiClient.signin(signinData)
    return result
  } catch (error: unknown) {
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
