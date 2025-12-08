import { locales } from '@/cms/locales'
import type { Locale } from '@/cms/types'

/** Gets the preferred locale from the request headers. If no valid locale is found, undefined is returned. */
export const localeFromHeader = (headers: Headers): Locale | undefined => {
  const localeFromHeader = headers.get('accept-language')?.slice(0, 2) as Locale | undefined
  return localeFromHeader && locales.includes(localeFromHeader) ? localeFromHeader : undefined
}
