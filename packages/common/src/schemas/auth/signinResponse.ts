import { z } from 'zod'

export const signinSuccessReplySchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string().nullish(),
    avatar: z.string().nullish(),
  }),
  accessToken: z.string(),
})

export type SigninSuccessOutput = z.infer<typeof signinSuccessReplySchema>
