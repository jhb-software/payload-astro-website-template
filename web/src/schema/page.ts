import { websiteConfig } from '@/config'
import { WEBSITE_URL } from 'astro:env/client'
import type { Page } from 'cms/src/payload-types'
import type { WebPage, WithContext } from 'schema-dts'
import { organizationSchema } from './organization'

export const pageSchema = (page: Page, locale: string): WithContext<WebPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.meta?.description ?? undefined,
    url: new URL(page.path, WEBSITE_URL).toString(),
    publisher: organizationSchema(),
    datePublished: page.createdAt,
    dateModified: page.updatedAt,
    inLanguage: locale,
    mainEntity: {
      '@type': 'WebSite',
      '@id': WEBSITE_URL,
      name: websiteConfig.name,
      publisher: organizationSchema(),
    },
  }
}
