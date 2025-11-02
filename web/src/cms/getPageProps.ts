import type { PageProps } from 'cms/src/endpoints/pageProps'
import { payloadSDK } from './sdk'

/** Fetches the `PageProps` for a given path. */
export async function getPageProps(path: string): Promise<PageProps> {
  const response = await payloadSDK.request({
    method: 'GET',
    path: '/page-props?path=' + path,
  })

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
