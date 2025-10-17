import { createEnv } from '@t3-oss/env-nextjs'
import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({
  path: '../../.env',
})

export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',

  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    NEXTAUTH_URL: z.url(),
    NEXTAUTH_SECRET: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    API_URL: z.url(),
    API_KEY: z.string(),
  },
  experimental__runtimeEnv: process.env,
})
