'use client'

import { navItems } from '@/lib/navigation'
import { classMerge } from '@ecom/ui/lib/utils'
import Link from 'next/link'

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

export default LeftNavBar
