import type { AstroGlobal } from 'astro'
import type { Footer, Header, Labels } from 'cms/src/payload-types'
import { getGlobalData } from './cms/getGlobalData'
import { defaultLocale } from './cms/locales'
import type { Locale } from './cms/types'
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

  const locale =
    localeFromPath(Astro.url.pathname) || localeFromHeader(Astro.request.headers) || defaultLocale
  const preview = Astro.url.pathname.startsWith('/preview')
  const { labels, header, footer } = await getGlobalData({ locale, preview })

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
