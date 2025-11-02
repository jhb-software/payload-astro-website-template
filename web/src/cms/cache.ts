/** Global cache for requests to the CMS */
interface CmsCache {
  /** Map storing CMS API requests with key of path and value of request data */
  readonly apiRequests: Map<string, unknown>
}

/** Global cache which stores frequently used CMS resources when building the website */
export const cache: CmsCache = {
  apiRequests: new Map(),
}

/** Clear all cached API requests */
export function clearCache(): void {
  cache.apiRequests.clear()
}
