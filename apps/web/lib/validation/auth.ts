import z from 'zod'

export const signInSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(8),
})

export const baseSignUpSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(8),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
})

export const signUpSchema = baseSignUpSchema
  .extend({
    confirmPassword: z.string().min(8),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      })
    }
  })

export type SignInData = z.infer<typeof signInSchema>
export type SignUpData = z.infer<typeof signUpSchema>
