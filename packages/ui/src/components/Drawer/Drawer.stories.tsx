import type { StoryObj } from '@storybook/react'
import { Menu, X } from 'lucide-react'
import React from 'react'

import { useWindowSize } from '@ecom/ui/hooks'
import { classMerge } from '@ecom/ui/lib/utils'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '.'
import { Button } from '../Button'

type Story = StoryObj<React.FC>

const navItems = [
  {
    label: 'Shop',
    href: '/shop',
  },
  {
    label: 'New Arrivals',
    href: '/new-arrivals',
  },
  {
    label: 'Brands',
    href: '/brands',
  },
  {
    label: 'About',
    href: '/about',
  },
]

export default {
  title: 'Components/Drawer',
  component: Drawer,
}

export const Default = {
  render: () => {
    const { width } = useWindowSize()
    const isMobile = width < 640

    return (
      <Drawer direction={isMobile ? 'bottom' : 'left'} fixed modal>
        <DrawerTrigger>
          <Menu className="!h-8 !w-8 outline-none" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="hidden items-center sm:flex">
            <DrawerClose asChild>
              <Button variant="ghost" className="h-8 w-8 p-1">
                <X className="!h-8 !w-8" />
              </Button>
            </DrawerClose>
            <DrawerTitle asChild>
              <span
                className={classMerge(
                  'font-integralCF px-1 py-[2px] align-middle !text-3xl font-extrabold outline-none',
                  'rounded focus:ring-[2px] focus:ring-neutral-700',
                )}>
                SHOP.CO
              </span>
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-1 pb-10 pt-6">
            {navItems.map((item) => (
              <span
                key={item.href}
                className={classMerge(
                  'block rounded px-6 py-2 text-lg outline-none transition-all',
                  'focus:ring-1 focus:ring-neutral-700',
                  'hover:bg-primary hover:text-white',
                )}>
                {item.label}
              </span>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    )
  },
} satisfies Story
