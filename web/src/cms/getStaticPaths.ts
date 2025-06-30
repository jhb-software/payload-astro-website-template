import { CMS_URL } from 'astro:env/server'
import type { PageProps } from 'cms/src/endpoints/pageProps'
import type { StaticPageProps } from 'cms/src/endpoints/staticPages'

export type StaticPagePropsFrontend = {
  params: {
    lang: string
    path: string | undefined
  }
  props: PageProps
}

/** Fetches the static paths from the CMS. */
export async function getStaticPaths(): Promise<StaticPagePropsFrontend[]> {
  const response = await fetch(`${CMS_URL}/api/static-paths`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Failed to fetch static paths. ' + JSON.stringify({ data }))
  }

  const paths: StaticPagePropsFrontend[] = []

  for (const path of data as StaticPageProps[]) {
    for (const lang of Object.keys(path.paths)) {
      paths.push({
        params: {
          lang: lang,
          path: path.paths[lang]?.replace(`/${lang}`, '') || undefined,
        },
        props: {
          id: path.id,
          collection: path.collection,
        },
      })
    }
  }

  return paths
}
