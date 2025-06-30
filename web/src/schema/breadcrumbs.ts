import { WEBSITE_URL } from 'astro:env/client'
import type { Breadcrumbs } from 'cms/src/payload-types'
import type { BreadcrumbList, WithContext } from 'schema-dts'

export const breadcrumbsSchema = (crumbs: Breadcrumbs): WithContext<BreadcrumbList> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: new URL(crumb.path, WEBSITE_URL).toString(),
    })),
  }
}
