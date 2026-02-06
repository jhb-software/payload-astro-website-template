import type { SitemapEntry } from 'cms/src/endpoints/sitemap'
import { payloadSDK } from './sdk'
import type { Locale } from './types'

/** Fetches the sitemap from the CMS. */
export async function getSitemap(locale: Locale): Promise<SitemapEntry[]> {
  const response = await payloadSDK.request({
    method: 'GET',
    path: `/sitemap?locale=${locale}`,
    init: {
      headers: {
        'X-Use-Cache': 'true',
      },
    },
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Failed to fetch sitemap. ' + JSON.stringify({ data }))
  }

  return data
}
