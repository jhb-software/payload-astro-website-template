import type { APIRoute } from 'astro'
import { WEBSITE_URL } from 'astro:env/client'
import { getSitemap } from '../../cms/getSitemap'
import { locales } from '../../cms/locales'
import type { Locale } from '../../cms/types'

export function getStaticPaths() {
  return locales.map((locale) => ({
    params: { lang: locale },
    props: { locale },
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const sitemapData = await getSitemap(props.locale as Locale)

  const pagesXml = sitemapData.map(({ path, updatedAt }) => {
    return `<url>
                <loc>${WEBSITE_URL}${path}</loc>
                <lastmod>${updatedAt}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>1.0</priority>
             </url>`
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
              ${pagesXml.join('')}
            </urlset>`

  return new Response(sitemap, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
