import z from 'zod'

export const signInSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(8),
})

export const signUpSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
})

export type SignInData = z.infer<typeof signInSchema>
export type SignUpData = z.infer<typeof signUpSchema>
