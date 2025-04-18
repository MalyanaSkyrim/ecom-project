import Link from 'next/link'

import { Button } from '@ecom/ui/index'

import CheckCircle from './CheckCircle'

const SignUpSuccess = () => {
  return (
    <div className="space-y-5 text-center">
      <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
      <div className="space-y-4">
        <div className="text-sm">
          <p>Your account has been created successfully.</p>
          <p>Use your credentials to sign in.</p>
        </div>
        <Button asChild variant="outline" className="w-fit min-w-[200px]">
          <Link href="/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  )
}

export default SignUpSuccess
