'use client'

import { Search, ShoppingCart, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { Button } from '@ecom/ui/components/Button'

import AccountDropDownMenu from '../AccountDropDownMenu'
import SearchInput from '../SearchInput'

const RightNavBar = () => {
  const { data: session, status } = useSession()

  return (
    <div className="flex items-center sm:space-x-5 lg:space-x-10">
      <div className="hidden sm:block">
        <SearchInput />
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" className="h-8 w-8 rounded-full p-2 sm:hidden">
          <Search className="!h-5 !w-5 outline-none" />
        </Button>

        {status === 'authenticated' ? (
          <>
            <Button
              variant="ghost"
              asChild
              className="h-8 w-8 rounded-full p-2">
              <Link href="/cart">
                <ShoppingCart className="!h-5 !w-5 outline-none" />
              </Link>
            </Button>
            <AccountDropDownMenu user={session.user} />
          </>
        ) : (
          <Button variant="link">
            <User className="!h-4 !w-4 outline-none" />
            <Link href="/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
export default RightNavBar
