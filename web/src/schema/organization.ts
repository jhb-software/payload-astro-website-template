import { websiteConfig } from '@/config'
import type { Organization, WithContext } from 'schema-dts'

export const organizationSchema = (): WithContext<Organization> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: websiteConfig.name,
    logo: websiteConfig.logo.url,
    sameAs: websiteConfig.socialUrls,
    url: websiteConfig.url,
  }
}
