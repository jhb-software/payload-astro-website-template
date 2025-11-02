import { PayloadSDK } from '@payloadcms/sdk'
import type { RedirectConfig } from 'astro'
import type { Config } from 'cms/src/payload-types'
import 'dotenv/config'

/** Fetches the redirects from the CMS and converts them to the Astro `RedirectConfig` format. */
export async function getRedirects(): Promise<Record<string, RedirectConfig>> {
  // Because import.meta.env and astro:env is not available in Astro config files and this method is called from
  // the Astro config file, use process.env to access the environment variable instead.
  const payloadSDK = new PayloadSDK<Config>({
    baseURL: process.env.CMS_URL! + '/api',
  })

  const redirectsCms = await payloadSDK.find({
    collection: 'redirects',
    limit: 0, // query all
    pagination: false,
  })

  const redirects = redirectsCms.docs.reduce<Record<string, RedirectConfig>>((acc, doc) => {
    acc[doc.sourcePath] = {
      destination: doc.destinationPath,
      status: doc.type === 'permanent' ? 301 : 302,
    }
    return acc
  }, {})

  return redirects
}
