import { z } from 'zod'

export const registerUrlBodySchema = z
  .object({
    url: z.string().url(),
  })
  .strict()

export type UrlBodySchema = z.infer<typeof registerUrlBodySchema>

export const urlIdSchema = z.string()
export type UrlIdSchema = z.infer<typeof urlIdSchema>
