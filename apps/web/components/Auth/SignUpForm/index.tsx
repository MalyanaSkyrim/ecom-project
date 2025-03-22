'use client'

import { signInSchema, SignUpData } from '@/lib/validation/auth'
import { Button, Form, FormInput } from '@ecom/ui'
import { UseFormReturn } from 'react-hook-form'

import GoogleSignInButton from '../GoogleSignInButton'

const SignUpForm = () => {
  const onSubmit = (data: SignUpData) => {
    console.log('sky', { data })
  }

  return (
    <Form schema={signInSchema} onSubmit={onSubmit}>
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
