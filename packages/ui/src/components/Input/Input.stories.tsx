import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Input } from '.'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  decorators: [
    (Story) => (
      <div className="w-full md:w-1/3">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Enter your name',
    disabled: true,
  },
}
