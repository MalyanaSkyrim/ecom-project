import type { Meta, StoryObj } from '@storybook/react'
import { Calendar, Smile } from 'lucide-react'
import React from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './index'

const meta: Meta<typeof Command> = {
  title: 'Components/Command',
  component: Command,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Command>

export const Default: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

export const WithSearch: Story = {
  render: () => {
    const items = [
      { id: '1', label: 'Apple' },
      { id: '2', label: 'Banana' },
      { id: '3', label: 'Cherry' },
      { id: '4', label: 'Date' },
      { id: '5', label: 'Elderberry' },
    ]

    return (
      <Command className="w-[450px] rounded-lg border shadow-md">
        <CommandInput placeholder="Search fruits..." />
        <CommandList>
          <CommandEmpty>No fruits found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem key={item.id} value={item.label}>
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  },
}

export const EmptyState: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </Command>
  ),
}
