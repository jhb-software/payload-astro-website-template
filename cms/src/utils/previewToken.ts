import { createHmac } from 'crypto'

const TOKEN_EXPIRY_DAYS = 7
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000

/**
 * Generates a compact HMAC-signed preview token which is validated by the frontend.
 * Format: expiry.signature
 */
export function generatePreviewToken(): string {
  const secret = process.env.PREVIEW_SECRET
  if (!secret) {
    throw new Error('PREVIEW_SECRET environment variable is not set')
  }

  const exp = Math.floor((Date.now() + TOKEN_EXPIRY_MS) / 1000) // Unix timestamp in seconds
  const sig = createHmac('sha256', secret).update(String(exp)).digest('base64url').slice(0, 16) // Truncate signature for shorter token (still secure)

  return `${exp}.${sig}`
}
