import { locales } from '../cms/locales'

/**
 * Normalizes the given path coming from the CMS to ensure it is a valid URL path. Prepends the preview mode prefix if needed.
 *
 * When a the path is invalid it will be fixed in prod and an error will be thrown in dev.
 * @param path - The path value of the CMS document to normalize.
 * @param preview - Whether the site is in preview mode.
 * @returns The normalized path
 */
export function normalizePath(path: string, preview: boolean) {
  if (
    !path ||
    !locales.includes(path.split('/').at(1) ?? '') ||
    path.endsWith('/') ||
    path.startsWith('/preview') ||
    path.includes('//')
  ) {
    throw new Error(`Invalid path given to normalizePath function: ${path}`)
  }

  if (preview && !path.startsWith('/preview')) {
    return '/preview' + path
  }

  return path
}
