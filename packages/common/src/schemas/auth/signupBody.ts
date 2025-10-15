import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  password: z.string(),
  avatar: z.string().nullish(),
})

export const signupBodySchema = userSchema.omit({
  id: true,
})

export type SignupInput = z.infer<typeof signupBodySchema>
export type User = z.infer<typeof userSchema>
