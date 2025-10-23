import type { Meta, StoryObj } from '@storybook/react'

import RangeFilter from './index'

const meta: Meta<typeof RangeFilter> = {
  title: 'Components/Filters/RangeFilter',
  component: RangeFilter,
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
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const PriceRange: Story = {
  args: {
    value: [50, 200],
    onChange: (value) => console.log('Price range:', value),
    min: 0,
    max: 500,
    step: 10,
    formatLabel: (value) => `$${value}`,
  },
}

export const AgeRange: Story = {
  args: {
    value: [18, 65],
    onChange: (value) => console.log('Age range:', value),
    min: 0,
    max: 100,
    step: 1,
    formatLabel: (value) => `${value} years`,
  },
}

export const RatingRange: Story = {
  args: {
    value: [3, 5],
    onChange: (value) => console.log('Rating range:', value),
    min: 0,
    max: 5,
    step: 0.1,
    formatLabel: (value) => `${value}⭐`,
  },
}
