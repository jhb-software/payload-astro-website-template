import type { PayloadRequest } from 'payload'

import { createHash } from 'crypto'

import type { Footer, Header, Labels } from '../payload-types'

export interface GlobalData {
  footer: Footer
  header: Header
  labels: Labels
}

/**
 * API handler which returns all global data (header, footer and labels) for a given locale.
 *
 * This endpoint consolidates multiple requests into a single call for better performance.
 */
export async function getGlobalData(req: PayloadRequest) {
  const locale = req.query.locale as 'de' | 'en' | undefined
  if (!locale || typeof locale !== 'string' || (locale != 'de' && locale != 'en')) {
    return new Response('Locale is required', { status: 400 })
  }

  const preview = req.query.preview === 'true'

  const baseOptions = {
    draft: preview,
    locale,
    req,
  }

  try {
    // Fetch all global data in parallel
    const [headerResponse, footerResponse, labelsResponse] = await Promise.all([
      req.payload.findGlobal({
        populate: {
          pages: {
            path: true,
          },
        },
        slug: 'header',
        ...baseOptions,
      }),
      req.payload.findGlobal({
        populate: {
          pages: {
            path: true,
          },
        },
        slug: 'footer',
        ...baseOptions,
      }),
      req.payload.findGlobal({
        slug: 'labels',
        ...baseOptions,
      }),
    ])

    const globalData: GlobalData = {
      footer: footerResponse,
      header: headerResponse,
      labels: labelsResponse,
    }

    const jsonString = JSON.stringify(globalData)
    const etag = createHash('md5').update(jsonString).digest('hex')

    // Check if the client has a matching etag
    const ifNoneMatch = req.headers.get('if-none-match')
    if (ifNoneMatch === etag) {
      return new Response(null, { status: 304 })
    }

    return new Response(jsonString, {
      headers: {
        'Cache-Control': preview ? 'no-cache' : 'public, max-age=60', // 1 minute cache for non-preview
        'Content-Type': 'application/json',
        ETag: etag,
      },
    })
  } catch (error) {
    console.error('Error fetching global data:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
