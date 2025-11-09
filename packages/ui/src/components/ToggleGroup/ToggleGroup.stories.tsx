import type { Meta, StoryObj } from '@storybook/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from 'lucide-react'
import React from 'react'

import { ToggleGroup, ToggleGroupItem } from './index'

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const SingleSelection: Story = {
  args: {
    type: 'single',
    defaultValue: 'bold',
    children: (
      <>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </>
    ),
  },
}

export const MultipleSelection: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['bold'],
    children: (
      <>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </>
    ),
  },
}

export const TextAlignment: Story = {
  args: {
    type: 'single',
    defaultValue: 'left',
    children: (
      <>
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
      </>
    ),
  },
}

export const OutlineVariant: Story = {
  args: {
    type: 'multiple',
    variant: 'outline',
    defaultValue: ['bold', 'italic'],
    children: (
      <>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </>
    ),
  },
}

export const SmallSize: Story = {
  args: {
    type: 'multiple',
    size: 'sm',
    defaultValue: ['bold'],
    children: (
      <>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </>
    ),
  },
}

export const LargeSize: Story = {
  args: {
    type: 'multiple',
    size: 'lg',
    defaultValue: ['bold'],
    children: (
      <>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </>
    ),
  },
}

export const FilterOptions: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['casual'],
    children: (
      <>
        <ToggleGroupItem value="casual">Casual</ToggleGroupItem>
        <ToggleGroupItem value="formal">Formal</ToggleGroupItem>
        <ToggleGroupItem value="party">Party</ToggleGroupItem>
        <ToggleGroupItem value="gym">Gym</ToggleGroupItem>
      </>
    ),
  },
}
