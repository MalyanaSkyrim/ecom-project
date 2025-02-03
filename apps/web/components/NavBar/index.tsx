import { Button } from '@ecom/ui/components/Button'
import { Search, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'

type NavItem = {
  label: string
  href: string
}

const navItems = [
  {
    label: 'Shop',
    href: '/shop',
  },
  {
    label: 'On Sale',
    href: '/on-sale',
  },
  {
    label: 'New Arrivals',
    href: '/new-arrivals',
  },
  {
    label: 'Brands',
    href: '/brands',
  },
] satisfies NavItem[]

const LeftNavBar = () => {
  return (
    <div className="flex items-center space-x-10">
      <p className="font-integralCF mb-2 align-middle text-3xl font-extrabold">
        SHOP.CO
      </p>

      <div className="flex items-center space-x-6">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

const RightNavBar = () => {
  return (
    <div className="flex items-center space-x-10">
      <div className="flex items-center space-x-2">
        <Search />
        <input />
      </div>
      <div className="flex items-center space-x-2">
        <Link href="/cart">
          <Button variant="ghost" className="h-8 w-8 rounded-full p-2">
            <ShoppingCart className="!h-5 !w-5" />
          </Button>
        </Link>
        <Link href="/account">
          <Button variant="ghost" className="h-8 w-8 rounded-full p-2">
            <User className="!h-5 !w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

const NavBar = () => {
  return (
    <div className="bg-white">
      <div className="container m-auto flex h-20 items-center justify-between">
        <LeftNavBar />
        <RightNavBar />
      </div>
    </div>
  )
}

export default NavBar
