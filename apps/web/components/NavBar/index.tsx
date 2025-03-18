import { navItems } from '@/lib/navigation'
import { Button } from '@ecom/ui/components/Button'
import { classMerge } from '@ecom/ui/lib/utils'
import { Search, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'

import SearchInput from '../SearchInput'
import MobileNavBar from './MobileNavBar'

const LeftNavBar = () => {
  return (
    <div className="flex items-center space-x-5 lg:space-x-10">
      <div className="flex items-center space-x-2">
        <MobileNavBar />
        <Link
          href="/"
          className={classMerge(
            'font-integralCF mb-2 px-1 py-[2px] align-middle text-3xl font-extrabold outline-none',
            'rounded focus:ring-[2px] focus:ring-neutral-700',
          )}>
          SHOP.CO
        </Link>
      </div>
      <div className="hidden items-center space-x-3 whitespace-nowrap text-sm md:flex lg:space-x-4 lg:text-base">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={classMerge(
              'px-1 py-[2px] outline-none transition-all',
              'border-b-[1.5px] border-transparent hover:border-gray-800',
              'focus:rounded focus:ring-2 focus:ring-neutral-700',
            )}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

const RightNavBar = () => {
  return (
    <div className="flex items-center sm:space-x-5 lg:space-x-10">
      <div className="hidden sm:block">
        <SearchInput />
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" className="h-8 w-8 rounded-full p-2 sm:hidden">
          <Search className="!h-5 !w-5 outline-none" />
        </Button>
        <Button variant="ghost" asChild className="h-8 w-8 rounded-full p-2">
          <Link href="/cart">
            <ShoppingCart className="!h-5 !w-5 outline-none" />
          </Link>
        </Button>
        <Button variant="ghost" asChild className="h-8 w-8 rounded-full p-2">
          <Link href="/account" className="">
            <User className="!h-5 !w-5 outline-none" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

const NavBar = () => {
  return (
    <div className="bg-white px-4">
      <div className="container m-auto flex h-20 items-center justify-between space-x-10">
        <LeftNavBar />
        <RightNavBar />
      </div>
    </div>
  )
}

export default NavBar
