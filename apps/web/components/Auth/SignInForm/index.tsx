'use client'

import { signInSchema, type SignInData } from '@/lib/validation/auth'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UseFormReturn } from 'react-hook-form'

import { Button, Form, FormInput } from '@ecom/ui'

import GoogleSignInButton from '../GoogleSignInButton'

const SignInForm = () => {
  const router = useRouter()
  const onSubmit = async (data: SignInData) => {
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/',
        redirect: false,
      })
      if (res?.ok) {
        router.push('/')
      }
    } catch (error) {
      // Handle error
    }
  }

  return (
    <Form schema={signInSchema} onSubmit={onSubmit}>
      {(form: UseFormReturn<SignInData>) => (
        <div className="space-y-5">
          <div className="space-y-4">
            <div>
              <FormInput control={form.control} name="email" label="Email" />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
              />
            </div>

            <div className="space-y-1">
              <Button
                className="w-full"
                type="submit"
                isLoading={form.formState.isSubmitting}>
                Sign In
              </Button>

              <Link
                href="/signup"
                className="block text-center text-sm underline">
                Create an account
              </Link>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gray-300"></div>

          <GoogleSignInButton disabled={form.formState.isSubmitting} />
        </div>
      )}
    </Form>
  )
}

export default SignInForm
