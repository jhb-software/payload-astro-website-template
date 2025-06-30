import type { APIRoute } from 'astro'
import { WEBSITE_URL } from 'astro:env/client'
import { locales } from '../cms/locales'

export const GET: APIRoute = async () => {
  const sitemapLinks = locales.map((locale) => {
    return `<sitemap>
              <loc>${WEBSITE_URL}/${locale}/sitemap.xml</loc>
            </sitemap>`
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
            <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              ${sitemapLinks.join('')}
            </sitemapindex>`

  return new Response(sitemap, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
