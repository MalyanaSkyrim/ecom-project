import type { Meta, StoryObj } from '@storybook/react'

import { RangeSlider } from './index'

const meta: Meta<typeof RangeSlider> = {
  title: 'Components/RangeSlider',
  component: RangeSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: [20, 80],
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-[400px]">
      <RangeSlider {...args} />
    </div>
  ),
}

export const PriceRange: Story = {
  args: {
    defaultValue: [50, 200],
    min: 0,
    max: 500,
    step: 10,
  },
  render: (args) => (
    <div className="w-[400px] space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>${args.defaultValue?.[0] || 0}</span>
        <span>${args.defaultValue?.[1] || 0}</span>
      </div>
      <RangeSlider {...args} />
    </div>
  ),
}

export const AgeRange: Story = {
  args: {
    defaultValue: [18, 65],
    min: 0,
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-[400px] space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{args.defaultValue?.[0] || 0} years</span>
        <span>{args.defaultValue?.[1] || 0} years</span>
      </div>
      <RangeSlider {...args} />
    </div>
  ),
}
