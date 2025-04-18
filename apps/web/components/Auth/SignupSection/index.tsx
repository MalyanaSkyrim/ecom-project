'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

import { classMerge } from '@ecom/ui/lib/utils'

import SignUpForm from './SignUpForm'
import SignUpSuccess from './SignUpSuccess'

const SignupSection = () => {
  const t = useTranslations()
  const [accountCreated, setAccountCreated] = useState(true)

  const handleSignupSuccess = () => {
    setAccountCreated(true)
  }
  return (
    <div
      className={classMerge(
        'w-[95%] space-y-6 rounded-lg bg-white px-7 pb-8 pt-6 shadow-md sm:w-[460px] sm:space-y-8 sm:px-10 sm:pb-12 sm:pt-7',
        accountCreated && 'sm:pb-9 sm:pt-6',
      )}>
      {accountCreated ? (
        <SignUpSuccess />
      ) : (
        <>
          <div className="w-full space-y-3">
            <Link
              href="/"
              className={classMerge(
                'font-integralCF mb-2 py-[2px] align-middle text-4xl font-extrabold outline-none',
                'rounded focus:ring-[2px] focus:ring-neutral-700',
              )}>
              SHOP.CO
            </Link>
            <p>{t('app_description')}</p>
          </div>
          <SignUpForm onSignupSuccess={handleSignupSuccess} />
        </>
      )}
    </div>
  )
}

export default SignupSection
