import z from 'zod'

export const locales = ['en', 'fr'] as const

export const localeEnum = z.enum(locales)

export type Locale = z.infer<typeof localeEnum>
