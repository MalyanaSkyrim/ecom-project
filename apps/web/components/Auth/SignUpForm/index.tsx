'use client'

import { trpc } from '@/lib/trpc/client'
import { SignUpData, signUpSchema } from '@/lib/validation/auth'
import { useRouter } from 'next/navigation'
import { UseFormReturn } from 'react-hook-form'

import { Button, Form, FormInput } from '@ecom/ui'

import GoogleSignInButton from '../GoogleSignInButton'

const SignUpForm = () => {
  const router = useRouter()
  const { mutateAsync } = trpc.auth.signUp.useMutation()

  const onSubmit = async (data: SignUpData) => {
    await mutateAsync(data)
    router.push('/signin')
  }

  return (
    <Form schema={signUpSchema} onSubmit={onSubmit}>
      {(form: UseFormReturn<SignUpData>) => (
        <div className="space-y-5">
          <div className="space-y-2">
            <div>
              <FormInput
                control={form.control}
                name="firstName"
                label="First Name"
              />
              <FormInput
                control={form.control}
                name="lastName"
                label="Last Name"
              />
              <FormInput control={form.control} name="email" label="Email" />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
              />
              <FormInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
              />
            </div>
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </div>
          <div className="h-[1px] w-full bg-gray-300"></div>
          <GoogleSignInButton />
        </div>
      )}
    </Form>
  )
}

export default SignUpForm
