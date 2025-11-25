import { PayloadSDK } from '@payloadcms/sdk'
import { CMS_URL } from 'astro:env/client'
import type { Config } from 'cms/src/payload-types'
import { createCachedFetch } from './sdk/cachedFetch'

/**
 * Payload SDK instance with caching support.
 *
 * This cache will cache responses forever, which is acceptable because the SDK-level cache
 * is only used during static site building (SSG), not during preview or SSR requests.
 * This means cached data will be "baked into" the generated static site and won't impact
 * local development or preview/SSR modes, which always request fresh data.
 *
 * Caching is opt-in and controlled via RequestInit headers:
 * - Set `X-Use-Cache: 'true'` to enable caching (only for GET requests).
 * - Omit or set `X-Use-Cache: 'false'` to disable caching (default).
 * - POST requests are never cached, regardless of the header value.
 */
export const payloadSDK = new PayloadSDK<Config>({
  baseURL: CMS_URL + '/api',
  fetch: createCachedFetch(globalThis.fetch),
})
