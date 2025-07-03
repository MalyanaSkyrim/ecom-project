import { type SelectProps } from '@radix-ui/react-select'
import type { StoryObj } from '@storybook/react'
import React from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '.'

type Story = StoryObj<React.FC<SelectProps>>

export default {
  title: 'Components/Select',
  component: Select,
}

const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
]

export const Default: Story = {
  args: {},
  render: (args) => {
    return (
      <Select {...args}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {themeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  },
}
