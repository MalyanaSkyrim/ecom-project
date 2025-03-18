import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-500 bg-[url(/img/welcome-background.jpg)] bg-cover bg-no-repeat bg-blend-overlay">
      {children}
    </div>
  )
}

export default AuthLayout
