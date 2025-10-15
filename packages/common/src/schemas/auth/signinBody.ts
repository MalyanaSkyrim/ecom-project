import { z } from 'zod'

export const signinBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SigninInput = z.infer<typeof signinBodySchema>
