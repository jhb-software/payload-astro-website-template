// @ts-check
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField, fontProviders } from 'astro/config'
import { getRedirects } from './src/cms/getRedirects'

export default defineConfig({
  redirects: await getRedirects(),
  adapter: vercel({
    middlewareMode: 'edge',
  }),
  vite: {
    plugins: [tailwindcss()],
    // Local dev proxy for /media/* - mirrors the Vercel rewrite in vercel.json
    server: {
      proxy: {
        '/media': {
          target: 'https://your-bucket.nbg1.your-objectstorage.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/media/, ''),
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              proxyRes.headers['cache-control'] =
                'public, max-age=2592000, s-maxage=31536000, stale-while-revalidate=86400, immutable'
            })
          },
        },
      },
    },
  },
  trailingSlash: 'never',
  env: {
    schema: {
      WEBSITE_URL: envField.string({
        context: 'client',
        access: 'public',
      }),
      CMS_URL: envField.string({
        context: 'client',
        access: 'public',
      }),
      CMS_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      VERCEL_ENV: envField.enum({
        values: ['production', 'preview', 'development'],
        context: 'server',
        access: 'public',
      }),
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      weights: ['100 900'],
      styles: ['normal'],
    },
  ],
})
