'use client'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ecom/ui'
import { User as UserIcon } from 'lucide-react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'

const AccountDropDownMenu = ({ user }: { user: User }) => {
  const fullName = `${user?.firstName} ${user?.lastName}`.trim()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" asChild className="h-8 w-8 rounded-full p-2">
          <span>
            <UserIcon className="!h-5 !w-5 outline-none" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="w-full text-left">
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountDropDownMenu
