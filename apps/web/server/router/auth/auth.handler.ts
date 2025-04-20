import { env } from '@/env'
import { SignUpData } from '@/lib/validation/auth'
import got from 'got'
import type { User } from 'next-auth'

export const signUp = async ({
  input,
}: {
  input: Omit<SignUpData, 'confirmPassword'>
}) => {
  try {
    const res = await got.post<{ user: User }>(
      `${env.API_URL}/v1/auth/signup`,
      {
        json: input,
        responseType: 'json',
      },
    )

    return res.body
  } catch (error: any) {
    if (error?.response?.body?.message) {
      throw new Error(error?.response?.body?.message)
    }
    throw error
  }
}
