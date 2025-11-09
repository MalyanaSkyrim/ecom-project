import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Breadcrumb } from './index'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: 'Electronics', path: '/products/electronics' },
    ],
  },
}

export const WithCustomSeparator: Story = {
  args: {
    items: [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: 'Category', path: '/products/category' },
    ],
    separator: <span>/</span>,
  },
}

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Home', path: '/' }],
  },
}
