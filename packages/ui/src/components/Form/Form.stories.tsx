import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { z } from 'zod'

import { Button } from '../Button'
import { Form, FormProps } from './Form'
import { FormInput } from './FormInput'

const formExampleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(0, 'Age must be a positive number'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export type FormExampleSchema = z.infer<typeof formExampleSchema>

type Story = StoryObj<React.FC<FormProps<typeof formExampleSchema>>>

export default {
  title: 'Components/Form',
  component: Form,
} satisfies Meta<typeof Form>

export const Default = {
  render: () => {
    const onSubmit = (data: FormExampleSchema) => {
      alert(`Form submitted ${JSON.stringify(data)}`)
    }
    return (
      <Form schema={formExampleSchema} onSubmit={onSubmit}>
        {(form) => (
          <div className="space-y-4 md:space-y-5">
            <div className="space-y-2 md:space-y-3">
              <FormInput
                control={form.control}
                name="name"
                label="First Name"
              />
              <FormInput
                control={form.control}
                name="age"
                label="Age"
                type="number"
              />
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
              />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              isLoading={form.formState.isSubmitting}>
              Sign Up
            </Button>
          </div>
        )}
      </Form>
    )
  },
} satisfies Story
