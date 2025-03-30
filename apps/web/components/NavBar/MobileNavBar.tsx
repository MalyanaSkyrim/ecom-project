'use client'

import { navItems } from '@/lib/navigation'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@ecom/ui'
import { useWindowSize } from '@ecom/ui/hooks'
import { classMerge } from '@ecom/ui/lib/utils'

const MobileNavBar = () => {
  const { width } = useWindowSize()

  const isMobile = width < 640

  const t = useTranslations('navigation')

  return (
    <Drawer direction={isMobile ? 'bottom' : 'left'} fixed modal>
      <DrawerTrigger className="md:hidden">
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
            <Link
              href="/"
              className={classMerge(
                'font-integralCF mb-2 px-1 py-[2px] align-middle !text-3xl font-extrabold outline-none',
                'rounded focus:ring-[2px] focus:ring-neutral-700',
              )}>
              SHOP.CO
            </Link>
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-1 pb-10 pt-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={classMerge(
                'block rounded px-6 py-2 text-lg outline-none transition-all',
                'focus:ring-1 focus:ring-neutral-700',
                'hover:bg-primary hover:text-white',
              )}>
              {t(item.label)}
            </Link>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileNavBar
