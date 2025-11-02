import type { AstroGlobal } from 'astro'
import type { Footer, Header, Labels } from 'cms/src/payload-types'
import { getLabels } from './cms/getLabels'
import { payloadSDK } from './cms/sdk'
import type { Locale } from './cms/types'
import { defaultLocale } from './cms/locales'
import { localeFromHeader } from './utils/localeFromHeader'
import { localeFromPath } from './utils/localeFromPath'

export interface GlobalState {
  readonly locale: Locale
  readonly preview: boolean
  readonly labels: Labels
  readonly header: Header
  readonly footer: Footer
}

/**
 * Initializes the globalState of the website by fetching global data from the CMS in a single request.
 * Stores the result in Astro.locals.globalState for request-scoped access.
 */
export async function initGlobalState(Astro: AstroGlobal): Promise<GlobalState> {
  // Deduplicate calls to initGlobalState - return existing value if already initialized
  if (Astro.locals.globalState) {
    return Astro.locals.globalState
  }

  const locale = localeFromPath(Astro.url.pathname) || localeFromHeader(Astro.request.headers) || defaultLocale
  const preview = Astro.url.pathname.startsWith('/preview')
  const labels = await getLabels({ locale, useCache: !preview })
  const footer = await payloadSDK.findGlobal(
    {
      slug: 'footer',
      locale: locale,
      populate: {
        pages: {
          path: true,
        },
      },
    },
    !preview,
  )
  const header = await payloadSDK.findGlobal(
    {
      slug: 'header',
      locale: locale,
      populate: {
        pages: {
          path: true,
        },
      },
    },
    !preview,
  )

  const globalState: GlobalState = {
    locale,
    preview,
    labels,
    header,
    footer,
  }

  // Store in Astro.locals for request-scoped access
  Astro.locals.globalState = globalState

  return globalState
}
