import type { Meta, StoryObj } from '@storybook/react'

import { Slider } from './index'

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
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
    defaultValue: [50],
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Slider {...args} />
    </div>
  ),
}

export const WithSteps: Story = {
  args: {
    defaultValue: [20],
    max: 100,
    step: 10,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Slider {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    defaultValue: [50],
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
