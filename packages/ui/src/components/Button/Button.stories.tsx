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
    isLoading: true,
  },
}

export const Outline: Story = {
  args: {
    ...Default.args,
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    ...Default.args,
    variant: 'ghost',
  },
}

export const Link: Story = {
  args: {
    ...Default.args,
    variant: 'link',
  },
}

export const Secondary: Story = {
  args: {
    ...Default.args,
    variant: 'secondary',
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
    ...Default.args,
    size: 'lg',
  },
}

export const Small: Story = {
  args: {
    ...Default.args,
    size: 'sm',
  },
}
