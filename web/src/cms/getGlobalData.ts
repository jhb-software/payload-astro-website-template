import type { Footer, Header, Labels } from 'cms/src/payload-types'
import { payloadSDK } from './sdk'
import type { Locale } from './types'

export interface GlobalData {
  header: Header
  footer: Footer
  labels: Labels
}

/**
 * Fetches all global data (header, footer, and labels) from the CMS in a single request.
 * This is more efficient than making separate requests for each global.
 */
export async function getGlobalData({
  locale,
  preview,
}: {
  locale: Locale
  preview: boolean
}): Promise<GlobalData> {
  // TODO: add cache once the new cached payload SDK is used

  const response = await payloadSDK.request({
    method: 'GET',
    path: `/global-data?locale=${locale}&preview=${preview}`,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch global data: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as GlobalData

  if (!data.header || !data.footer || !data.labels) {
    console.error(data)
    throw new Error('Incomplete global data received from CMS')
  }

  return data
}
