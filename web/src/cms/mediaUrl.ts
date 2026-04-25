import { WEBSITE_URL } from 'astro:env/client'
import { VERCEL_ENV } from 'astro:env/server'

/**
 * Converts a media URL returned by the CMS (an absolute S3 URL) into a relative
 * `/media/<path>` URL that the frontend serves. In production/preview, Vercel
 * rewrites `/media/*` to the S3 bucket and adds cache-control headers
 * (see `web/vercel.json`). In development the rewrite is not active, so the
 * original S3 URL is returned unchanged.
 */
export function mediaUrl(url: string): string {
  if (VERCEL_ENV === 'development') {
    return url
  }

  try {
    return '/media' + new URL(url).pathname
  } catch {
    return url
  }
}

/**
 * Same as `mediaUrl` but resolved against `WEBSITE_URL`, for contexts that
 * require an absolute URL (e.g. JSON-LD structured data, Open Graph tags).
 */
export function absoluteMediaUrl(url: string): string {
  const rewritten = mediaUrl(url)
  if (rewritten.startsWith('http://') || rewritten.startsWith('https://')) {
    return rewritten
  }
  return new URL(rewritten, WEBSITE_URL).toString()
}
