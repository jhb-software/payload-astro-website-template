import type { AstroGlobal } from 'astro'
import type { Footer, Header, Labels } from 'cms/src/payload-types'
import { getLabels } from './cms/getLabels'
import { payloadSDK } from './cms/getRedirects'
import type { Locale } from './cms/types'

interface GlobalState {
  readonly locale: Locale
  readonly preview: boolean
  readonly labels: Labels
  readonly header: Header
  readonly footer: Footer
}

/** Global state which should be initialized with initGlobalState() at the top of every page */
export let globalState: GlobalState

/**
 * Initializes the globalState of the website by fetching global data based on path params of the provided URL from the CMS.
 */
export async function initGlobalState(Astro: AstroGlobal) {
  const locale = Astro.props.lang as Locale
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

  globalState = {
    locale,
    preview,
    labels,
    header,
    footer,
  }
}
