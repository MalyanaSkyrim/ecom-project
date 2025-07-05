import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import ToastContent, { type ToastContentProps } from './ToastContent'

type Story = StoryObj<React.FC<ToastContentProps>>

export default {
  title: 'Components/Toaster',
  component: ToastContent,
} satisfies Meta<typeof ToastContent>

export const Info: Story = {
  args: {
    title: 'Info Toast',
    description: 'This is an info toast message',
    variant: 'info',
  },
}

export const Warning: Story = {
  args: {
    title: 'Warning Toast',
    description: 'This is an warning toast message',
    variant: 'warning',
  },
}

export const Success: Story = {
  args: {
    title: 'Success Toast',
    description: 'This is an success toast message',
    variant: 'success',
  },
}

export const Error: Story = {
  args: {
    title: 'Error Toast',
    description: 'This is an error toast message',
    variant: 'error',
  },
}
