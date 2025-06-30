import { CMS_URL } from 'astro:env/server'
import type { SitemapEntry } from 'cms/src/endpoints/sitemap'
import type { Locale } from './types'

/** Fetches the sitemap from the CMS. */
export async function getSitemap(locale: Locale): Promise<SitemapEntry[]> {
  const response = await fetch(`${CMS_URL}/api/sitemap?locale=${locale}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Failed to fetch sitemap. ' + JSON.stringify({ data }))
  }

  return data
}
