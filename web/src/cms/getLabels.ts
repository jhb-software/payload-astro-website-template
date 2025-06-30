import type { Labels } from 'cms/src/payload-types'
import { payloadSDK } from './sdk'
import type { Locale } from './types'

/** Fetches the labels from the CMS. */
export async function getLabels({
  locale,
  useCache = true,
}: {
  locale: Locale
  useCache?: boolean
}): Promise<Labels> {
  return await payloadSDK.findGlobal(
    {
      slug: 'labels',
      locale,
    },
    useCache,
  )
}
