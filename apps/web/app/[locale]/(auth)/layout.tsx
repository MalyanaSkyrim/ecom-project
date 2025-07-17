import { authOptions } from '@/lib/auth/authOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions)

  if (session) redirect('/')

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-500 bg-[url(/img/welcome_background.jpg)] bg-cover bg-no-repeat bg-blend-overlay">
      {children}
    </div>
  )
}

export default AuthLayout
