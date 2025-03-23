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
import { LogOut, User as UserIcon } from 'lucide-react'
import { User } from 'next-auth'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import LanguageSelect from '../LanguageSelect'

const AccountDropDownMenu = ({ user }: { user: User }) => {
  const fullName = `${user?.firstName} ${user?.lastName}`.trim()
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-2">
          <UserIcon className="!h-5 !w-5 outline-none" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[220px] space-y-1">
        <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-9" asChild>
          <Link href="/profile">{t('profile')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="justify-between">
          <span>{t('languages')}</span>
          <LanguageSelect />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            variant="outline"
            // onClick={() => signOut()}
            className="w-full">
            <LogOut className="!h-4 !w-4 outline-none" />
            <span>{t('logout')}</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountDropDownMenu
