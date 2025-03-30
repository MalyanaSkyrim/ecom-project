import SignUpForm from '@/components/Auth/SignUpForm'
import { authOptions } from '@/lib/auth/authOptions'
import { getServerSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { classMerge } from '@ecom/ui/lib/utils'

const SignUpPage = async () => {
  const session = await getServerSession(authOptions)
  const t = await getTranslations()

  if (session) redirect('/')

  return (
    <div className="w-[95%] space-y-6 rounded-lg bg-white px-7 pb-8 pt-6 shadow-md sm:w-[460px] sm:space-y-8 sm:px-10 sm:pb-12 sm:pt-7">
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
      <SignUpForm />
    </div>
  )
}

export default SignUpPage
