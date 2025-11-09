import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Select, type SelectOption } from '.'

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
}

export default meta

type Story = StoryObj<typeof Select>

const baseOptions: SelectOption[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System', disabled: true },
]

export const MultipleOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState<SelectOption | undefined>(
      baseOptions[0],
    )

    return (
      <div className="space-y-3">
        <div className="w-48">
          <Select
            options={baseOptions}
            default={selected?.id}
            onSelect={(option) => setSelected(option)}
          />
        </div>
        <p className="text-sm">
          Selected:{' '}
          <span className="font-medium">{selected?.label ?? 'None'}</span>
        </p>
      </div>
    )
  },
}

export const DisabledSelect: Story = {
  render: () => (
    <div className="w-48">
      <Select
        options={baseOptions}
        default={baseOptions[0]?.id}
        disabled
        onSelect={() => {
          // Disabled select - no action expected
        }}
      />
    </div>
  ),
}

const colorOptions: SelectOption[] = [
  { id: 'red', label: 'Red' },
  { id: 'green', label: 'Green' },
  { id: 'blue', label: 'Blue' },
]

export const CustomOption: Story = {
  render: () => (
    <div className="w-48">
      <Select
        options={colorOptions}
        default={colorOptions[0]?.id}
        onSelect={() => {
          // For demo purposes
        }}
        renderOption={(option) => (
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: option.id }}
            />
            <span className="flex-1">{option.label}</span>
            <span className="text-muted-foreground text-xs uppercase">
              {option.id}
            </span>
          </div>
        )}
      />
    </div>
  ),
}
