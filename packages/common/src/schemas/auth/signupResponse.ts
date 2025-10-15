import { z } from 'zod'

import { userSchema } from './signupBody'

export const signupSuccessReplySchema = z.object({
  user: userSchema.omit({
    password: true,
  }),
})

export type SignupSuccessOutput = z.infer<typeof signupSuccessReplySchema>
