import * as crypto from 'crypto'

export function generateShortUrl(): string {
  const randomBytes = crypto.randomBytes(4).toString('base64url')

  const hashSnippet = randomBytes.slice(0, 6)

  return hashSnippet
}
