import type { Config } from '@/payload-types'
import { locales, pageCollectionsSlugs } from '@/payload.config'
import { createHash } from 'crypto'
import { CollectionSlug, PayloadRequest } from 'payload'
import { StaticPageProps } from './staticPages'

export type PageProps = Omit<StaticPageProps, 'paths'>

/**
 * API handler which returns the `PageProps` of the page with the given path.
 *
 * This is used for the preview mode in the frontend.
 */
export async function getPagePropsByPath(req: PayloadRequest) {
  const path = req.query.path as string | undefined

  if (!path) {
    return new Response('No path provided in the body', { status: 400 })
  } else if (path.endsWith('/')) {
    return new Response('The provided path should not end with a trailing slash.', { status: 400 })
  } else if (!locales.includes(path.split('/')[1] as Config['locale'])) {
    return new Response(`The provided path does not start with ${locales.join(' or ')}.`, {
      status: 400,
    })
  }

  const parts = path.split('/')
  const locale = parts[1] as Config['locale']
  const slugs = parts.slice(2)

  // If there is none or only one slug after the locale, the path is for a page in the pages collection.
  // Therefore iterate over the pages collection first. Otherwise the order does not matter.
  const collections: CollectionSlug[] =
    slugs.length <= 1
      ? ['pages', ...pageCollectionsSlugs.filter((collection) => collection !== 'pages')]
      : pageCollectionsSlugs

  for (const collection of collections) {
    const data = await req.payload.find({
      collection: collection as CollectionSlug,
      limit: 1000,
      locale: locale,
      depth: 0,
      // For pages which have not been published yet (draft), the CMS by default returns the first/oldest draft instead of the latest draft.
      // This is a problem, because in the first version, there may be no parent set for all locales.
      // Therefore, set draft to true, which always returns the latest published or draft version.
      // ATTENTION: For published pages, this might return the latest unpublisheddraft instead of the published version.
      draft: true,
      where: {
        // filtering for the virtual path field is not supported, as it is not stored in the database
        // Instead, filter for the document slug, which always is the last part of the path
        slug: {
          equals: slugs.at(-1) ?? '',
        },
      },
      select: {
        id: true,
        slug: true,
        path: true,
        template: true,
      },
    })

    for (const doc of data.docs as unknown as { path: string; id: string }[]) {
      if (doc.path === path) {
        const pageProps: PageProps = {
          id: doc.id,
          collection: collection,
        }

        const jsonString = JSON.stringify(pageProps)
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
    }
  }

  return new Response(`No collection found for the given path ${path}`, { status: 404 })
}
