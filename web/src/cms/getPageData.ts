import type { CollectionSlug } from 'payload'
import { payloadSDK } from './sdk'
import type { Locale } from './types'

/** Fetches a single page document from the CMS. */
export async function getPageData<T>(
  collection: CollectionSlug,
  id: string,
  locale: Locale,
  options?: { preview?: boolean },
): Promise<T> {
  const result = await payloadSDK.find(
    {
      // @ts-expect-error - collection is not typed
      collection: collection,
      locale,
      draft: options?.preview ? true : false,
      where: {
        id: {
          equals: id,
        },
        _status: options?.preview ? { in: ['draft', 'published'] } : { equals: 'published' },
      },
      limit: 1,
      pagination: false,
    },
    !options?.preview, // use cache if not in preview mode
  )

  if (result.totalDocs === 0) {
    throw new Error('Page for collection ' + collection + ' with id ' + id + ' not found')
  }

  return result.docs.at(0) as T
}
