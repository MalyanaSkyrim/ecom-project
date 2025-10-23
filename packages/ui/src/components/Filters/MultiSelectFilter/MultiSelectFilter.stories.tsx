import type { Meta, StoryObj } from '@storybook/react'

import MultiSelectFilter from './index'

const meta: Meta<typeof MultiSelectFilter> = {
  title: 'Components/Filters/MultiSelectFilter',
  component: MultiSelectFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['list', 'chips'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const categories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans']
const styles = ['Casual', 'Formal', 'Party', 'Gym']
const sizes = [
  'XX-Small',
  'X-Small',
  'Small',
  'Medium',
  'Large',
  'X-Large',
  'XX-Large',
]

export const ListVariant: Story = {
  args: {
    value: ['T-shirts', 'Hoodie'],
    onChange: (value) => console.log('Selected:', value),
    options: categories,
    variant: 'list',
  },
}

export const ChipsVariant: Story = {
  args: {
    value: ['Large', 'X-Large'],
    onChange: (value) => console.log('Selected:', value),
    options: sizes,
    variant: 'chips',
  },
}

export const StylesList: Story = {
  args: {
    value: ['Casual'],
    onChange: (value) => console.log('Selected:', value),
    options: styles,
    variant: 'list',
  },
}

export const SingleSelect: Story = {
  args: {
    value: ['Casual'],
    onChange: (value) => console.log('Selected:', value),
    options: styles,
    variant: 'list',
    multiSelect: false,
  },
}
