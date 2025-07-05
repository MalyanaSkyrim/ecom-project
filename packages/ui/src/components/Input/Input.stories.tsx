import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Input, InputProps } from '.'

type Story = StoryObj<React.FC<InputProps>>

export default {
  title: 'Components/Input',
  component: Input,
  decorators: [
    (Story) => (
      <div className="w-full md:w-1/3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}
