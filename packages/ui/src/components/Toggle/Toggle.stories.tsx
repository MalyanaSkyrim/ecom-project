import type { Meta, StoryObj } from '@storybook/react'
import { Bold, Italic, Underline } from 'lucide-react'
import React from 'react'

import { Toggle } from './index'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  args: {
    children: 'Toggle',
  },
}

export const WithIcon: Story = {
  args: {
    children: <Bold className="h-4 w-4" />,
    'aria-label': 'Bold',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: <Italic className="h-4 w-4" />,
    'aria-label': 'Italic',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}

export const Pressed: Story = {
  args: {
    pressed: true,
    children: <Underline className="h-4 w-4" />,
    'aria-label': 'Underline',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}
