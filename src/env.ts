import { z } from 'zod'
import 'dotenv/config'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),

  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_EXPIRES_IN: z.string(),
  COOKIE: z.coerce.string(),

  URL_BASE: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
})

export type Env = z.infer<typeof envSchema>

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
