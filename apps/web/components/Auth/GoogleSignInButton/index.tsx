import { signIn } from 'next-auth/react'

import { Button, GoogleLogo } from '@ecom/ui'

const GoogleSignInButton = ({ disabled }: { disabled?: boolean }) => {
  return (
    <Button
      disabled={disabled}
      type="button"
      onClick={() => signIn('google')}
      className="w-full"
      variant="outline">
      <GoogleLogo className="h-6 w-6" />
      <span>Sign up with Google</span>
    </Button>
  )
}

export default GoogleSignInButton
