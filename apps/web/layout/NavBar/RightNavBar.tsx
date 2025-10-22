'use client'

import AccountDropDownMenu from '@/components/AccountDropDownMenu'
import LanguageSelect from '@/components/LanguageSelect'
import SearchInput from '@/components/SearchInput'
import { Search, ShoppingCart, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { Button } from '@ecom/ui/components/Button'

const RightNavBar = () => {
  const { data: session, status } = useSession()

  console.log('sky session:', {
    session,
    status,
  })

  return (
    <div className="flex items-center sm:space-x-5 lg:space-x-10">
      <div className="hidden sm:block">
        <SearchInput />
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button
          variant="ghost"
          className="h-6 w-6 rounded-full p-1 sm:hidden sm:h-8 sm:w-8 sm:p-2">
          <Search className="h-4 w-4 outline-none sm:h-5 sm:w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          {status === 'authenticated' ? (
            <>
              <Button
                variant="ghost"
                asChild
                className="h-6 w-6 rounded-full p-2 sm:h-8 sm:w-8">
                <Link href="/cart">
                  <ShoppingCart className="!h-5 !w-5 outline-none" />
                </Link>
              </Button>

              <AccountDropDownMenu user={session.user} />
            </>
          ) : (
            <Button variant="link" className="px-2">
              <Link href="/signin" className="flex items-center space-x-1">
                <User className="!h-4 !w-4 outline-none" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            </Button>
          )}
          <LanguageSelect />
        </div>
      </div>
    </div>
  )
}
export default RightNavBar
