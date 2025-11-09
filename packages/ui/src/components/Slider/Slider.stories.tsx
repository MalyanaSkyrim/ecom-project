import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Slider } from './index'

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['single', 'range'],
    },
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
type Story = StoryObj<typeof Slider>

export const SingleSlider: Story = {
  args: {
    variant: 'single',
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Slider {...args} />
    </div>
  ),
}

export const RangeSlider: Story = {
  args: {
    variant: 'range',
    defaultValue: [20, 80],
    min: 0,
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Slider {...args} />
    </div>
  ),
}

export const WithPriceLabels: Story = {
  args: {
    variant: 'range',
    defaultValue: [50, 200],
    min: 0,
    max: 500,
    step: 10,
    formatLabel: (value: number) => `$${value}`,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Slider {...args} />
    </div>
  ),
}

export const WithCustomLabels: Story = {
  args: {
    variant: 'single',
    defaultValue: 5,
    min: 0,
    max: 10,
    step: 1,
    formatLabel: (value: number) => `${value} items`,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Slider {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    variant: 'single',
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: true,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Slider {...args} />
    </div>
  ),
}

export const DisabledRange: Story = {
  args: {
    variant: 'range',
    defaultValue: [20, 80],
    min: 0,
    max: 100,
    step: 1,
    disabled: true,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Slider {...args} />
    </div>
  ),
}
