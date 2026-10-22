import type { PageProps } from 'cms/src/endpoints/pageProps'
import { payloadSDK } from './sdk'

/** Fetches the `PageProps` for a given path. Returns `null` if no page exists for the path. */
export async function getPageProps(path: string): Promise<PageProps | null> {
  const response = await payloadSDK.request({
    method: 'GET',
    path: '/page-props?path=' + encodeURIComponent(path),
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(
      'Failed to fetch page props for path: ' +
        path +
        '. Status: ' +
        response.status +
        '. Response: ' +
        (await response.text()),
    )
  }
  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      'Failed to fetch page props for path: ' + path + '. ' + JSON.stringify({ data }),
    )
  }

  return data
}
