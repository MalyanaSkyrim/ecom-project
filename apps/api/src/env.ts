import { createEnv } from '@t3-oss/env-core'
import dotenv from 'dotenv'
import z from 'zod'

dotenv.config({ path: '../../.env' })

export const env = createEnv({
  /*
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',

  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production', 'staging'])
      .default('development'),
    RATE_LIMIT_MAX: z.coerce.number().default(500),
    RATE_LIMIT_TIME_WINDOW: z.coerce.number().default(60000),
    API_PORT: z.coerce.number().default(4000),
    APP_ENV: z
      .enum(['development', 'production', 'staging'])
      .default('development'),

    API_URL: z.string().default('http://localhost:4000'),
    API_KEY: z.string(),
    REDIS_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
  },
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: process.env,
})
