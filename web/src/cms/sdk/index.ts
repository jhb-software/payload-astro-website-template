import { CMS_URL } from 'astro:env/server'
import type { Config } from 'cms/src/payload-types'
import { PayloadSDK } from './sdk'

export const payloadSDK = new PayloadSDK<Config>({
  baseURL: CMS_URL + '/api',
})
