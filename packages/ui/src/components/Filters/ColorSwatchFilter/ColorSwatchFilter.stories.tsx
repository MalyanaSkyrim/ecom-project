import type { Meta, StoryObj } from '@storybook/react'

import ColorSwatchFilter from './index'

const meta: Meta<typeof ColorSwatchFilter> = {
  title: 'Components/Filters/ColorSwatchFilter',
  component: ColorSwatchFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'number',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const colors = [
  { name: 'Green', hex: '#00C12B' },
  { name: 'Red', hex: '#F50606' },
  { name: 'Yellow', hex: '#F5DD06' },
  { name: 'Orange', hex: '#F57906' },
  { name: 'Cyan', hex: '#06CAF5' },
  { name: 'Blue', hex: '#063AF5' },
  { name: 'Purple', hex: '#7D06F5' },
  { name: 'Pink', hex: '#F506A4' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
]

export const Default: Story = {
  args: {
    value: ['Blue', 'Black'],
    onChange: (value) => console.log('Selected colors:', value),
    colors,
    columns: 5,
  },
}

export const SixColumns: Story = {
  args: {
    value: ['Red', 'Yellow', 'White'],
    onChange: (value) => console.log('Selected colors:', value),
    colors,
    columns: 6,
  },
}
