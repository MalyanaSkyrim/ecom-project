'use client'

import { trpc } from '@/lib/trpc/client'
import { SignUpData, signUpSchema } from '@/lib/validation/auth'
import { UseFormReturn } from 'react-hook-form'

import { Button, Form, FormInput, showToast } from '@ecom/ui'

import GoogleSignInButton from '../GoogleSignInButton'

const SignUpForm = ({ onSignupSuccess }: { onSignupSuccess: () => void }) => {
  const { mutateAsync, isPending } = trpc.auth.signUp.useMutation()

  const onSubmit = async (data: SignUpData) => {
    try {
      await mutateAsync(data)
      onSignupSuccess()
      showToast({
        id: 'signup-success',
        title: 'Your account has been created successfully.',
        variant: 'success',
        duration: 3000,
      })
    } catch (error) {
      const errorMessage = (error as Error).message
      showToast({
        id: 'signup-error',
        title: errorMessage,
        variant: 'error',
        duration: 3000,
      })
    }
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
            <Button className="w-full" type="submit" isLoading={isPending}>
              Sign Up
            </Button>
          </div>
          <div className="h-[1px] w-full bg-gray-300"></div>
          <GoogleSignInButton disabled={isPending} />
        </div>
      )}
    </Form>
  )
}

export default SignUpForm
