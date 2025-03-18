'use client'

import { signInSchema, type SignInData } from '@/lib/validation/auth'
import { Form, FormInput } from '@ecom/ui'
import { Button } from '@ecom/ui/index'
import Link from 'next/link'
import { UseFormReturn } from 'react-hook-form'

import GoogleSignInButton from '../GoogleSignInButton'

const SignInForm = () => {
  const onSubmit = (data: SignInData) => {
    console.log('sky', { data })
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
              <Button className="w-full" type="submit">
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

          <GoogleSignInButton />
        </div>
      )}
    </Form>
  )
}

export default SignInForm
