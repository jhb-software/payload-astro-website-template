import { locales } from '@/cms/locales'
import type { Locale } from '@/cms/types'

/** Gets the locale from the path. If no valid locale is found, undefined is returned. */
export const localeFromPath = (path: string): Locale | undefined => {
  const localeFromPath = path.startsWith('/preview')
    ? (path.split('/').at(2) as Locale | undefined)
    : (path.split('/').at(1) as Locale | undefined)
  return localeFromPath && locales.includes(localeFromPath) ? localeFromPath : undefined
}
