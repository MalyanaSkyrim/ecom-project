import type { StoryObj } from '@storybook/react'

import { Button, ButtonProps } from '.'

type Story = StoryObj<React.FC<ButtonProps>>

export default {
  title: 'Example/Button',
  component: Button,
}

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
}

export const Destructive: Story = {
  args: {
    ...Default.args,
    variant: 'destructive',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}
