import { env } from '@/env'
import { SignUpData } from '@/lib/validation/auth'
import got from 'got'

export const signUp = async ({
  input,
}: {
  input: Omit<SignUpData, 'confirmPassword'>
}) => {
  await got.post<SignUpData>(`${env.API_URL}/v1/auth/signup`, {
    json: input,
    responseType: 'json',
  })
}
