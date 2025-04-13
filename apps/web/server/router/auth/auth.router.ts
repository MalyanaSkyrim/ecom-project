import { baseSignUpSchema } from '@/lib/validation/auth'
import { procedure, router } from '@/server/trpc'

import { signUp } from './auth.handler'

const authRouter = router({
  signUp: procedure.input(baseSignUpSchema).mutation(signUp),
})

export default authRouter
