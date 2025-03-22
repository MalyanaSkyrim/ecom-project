import SignInForm from '@/components/Auth/SignInForm'
import { authOptions } from '@/lib/auth/authOptions'
import { classMerge } from '@ecom/ui/lib/utils'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const SignInPage = async () => {
  const session = await getServerSession(authOptions)

  if (session) redirect('/')

  return (
    <div className="w-[95%] space-y-8 rounded-lg bg-white px-7 pb-12 pt-7 shadow-md sm:w-[460px] sm:px-10">
      <div className="w-full space-y-3">
        <Link
          href="/"
          className={classMerge(
            'font-integralCF mb-2 py-[2px] align-middle text-4xl font-extrabold outline-none',
            'rounded focus:ring-[2px] focus:ring-neutral-700',
          )}>
          SHOP.CO
        </Link>
        <p>Discover Quality. Shop with Confidence.</p>
      </div>
      <SignInForm />
    </div>
  )
}

export default SignInPage
