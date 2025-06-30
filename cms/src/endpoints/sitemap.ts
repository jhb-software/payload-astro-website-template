import type { Config } from '@/payload-types'
import { locales, pageCollectionsSlugs } from '@/payload.config'
import { createHash } from 'crypto'
import { PayloadRequest } from 'payload'

export type SitemapEntry = {
  path: string
  updatedAt: string
}

/**
 * Returns a list of all sitemap entries for the given locale.
 */
export async function getSitemap(req: PayloadRequest) {
  const locale = String(req.query.locale) as Config['locale']

  if (!locale) {
    return new Response('No locale query parameter provided.', { status: 400 })
  } else if (!locales.includes(locale)) {
    return new Response(
      `Invalid locale query parameter provided. Only ${locales.join(', ')} are allowed.`,
      {
        status: 400,
      },
    )
  }

  const pages: SitemapEntry[] = []

  for (const collection of pageCollectionsSlugs) {
    const data = await req.payload.find({
      collection: collection,
      limit: 0, // fetch all docs
      locale: locale,
      depth: 0, // do not fetch related docs
      where: {
        _status: { equals: 'published' },
      },
      select: {
        path: true,
        updatedAt: true,
      },
    })

    type Doc = {
      id: string
      path: string
      updatedAt: string
    }

    for (const doc of data.docs as Doc[]) {
      pages.push({
        path: doc.path,
        updatedAt: doc.updatedAt,
      })
    }
  }

  const jsonString = JSON.stringify(pages)
  const etag = createHash('md5').update(jsonString).digest('hex')

  // Check if the client has a matching etag
  const ifNoneMatch = req.headers.get('if-none-match')
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304 })
  }

  return new Response(jsonString, {
    headers: {
      'Content-Type': 'application/json',
      ETag: etag,
      'Cache-Control': 'no-cache',
    },
  })
}
