// @ts-check
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import { getRedirects } from './src/cms/getRedirects'

export default defineConfig({
  redirects: await getRedirects(),
  adapter: vercel({
    edgeMiddleware: true,
  }),
  vite: {
    plugins: [tailwindcss()],
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
      VERCEL_ENV: envField.enum({
        values: ['production', 'preview', 'development'],
        context: 'server',
        access: 'public',
      }),
    },
  },
})
