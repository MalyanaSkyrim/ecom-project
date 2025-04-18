import SignupSection from '@/components/Auth/SignupSection'
import { authOptions } from '@/lib/auth/authOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const SignUpPage = async () => {
  const session = await getServerSession(authOptions)

  if (session) redirect('/')

  return <SignupSection />
}

export default SignUpPage
