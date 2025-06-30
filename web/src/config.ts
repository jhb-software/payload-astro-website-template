import { WEBSITE_URL } from 'astro:env/client'
import type { Locale } from './cms/types'

type WebsiteConfig = {
  url: string
  name: string
  domain: string
  icon: string
  logo: {
    path: string
    url: string
  }
  ogImage: {
    path: (locale: Locale) => string
    url: (locale: Locale) => string
  }
  socialUrls: string[]
}

export const websiteConfig: WebsiteConfig = {
  url: WEBSITE_URL,
  name: 'JHB Payload Astro Website Template',
  domain: 'your-domain.com',
  icon: '/icon.png',
  logo: {
    path: '/logo.webp',
    url: new URL('/logo.webp', WEBSITE_URL).toString(),
  },
  ogImage: {
    path: (locale: Locale) => `/og_${locale}.png`,
    url: (locale: Locale) => new URL(`/og_${locale}.png`, WEBSITE_URL).toString(),
  },
  socialUrls: ['https://github.com', 'https://www.x.com', 'https://www.linkedin.com'],
}
