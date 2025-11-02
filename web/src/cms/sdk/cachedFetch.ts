import { cache } from '../cache'

/**
 * Creates a cache key from the URL and init options
 */
function createCacheKey(url: string, init?: RequestInit): string {
  const method = init?.method || 'GET'
  const body = init?.body
  const headers = init?.headers
  return `${method}:${url}:${body ? String(body) : ''}:${headers ? JSON.stringify(headers) : ''}`
}

/**
 * Custom fetch handler with caching support.
 * Caching is opt-in via the 'X-Use-Cache' header and only applies to GET requests.
 * POST requests are never cached.
 */
export function createCachedFetch(baseFetch: typeof fetch): typeof fetch {
  return async function cachedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    // Convert input to URL string for caching
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

    // Get the HTTP method
    const method = init?.method || 'GET'

    // Extract cache preference from a custom header - must be explicitly 'true' to enable caching
    const useCache =
      init?.headers instanceof Headers
        ? init.headers.get('X-Use-Cache') === 'true'
        : typeof init?.headers === 'object' && init.headers !== null
          ? (init.headers as Record<string, string>)['X-Use-Cache'] === 'true'
          : false

    // Only cache GET requests when explicitly opted in
    // POST requests (and other non-GET methods) are never cached
    const shouldCache = useCache && method === 'GET'

    if (shouldCache) {
      const cacheKey = createCacheKey(url, init)
      const cachedData = cache.apiRequests.get(cacheKey)

      if (cachedData) {
        // Return a Response object from cached data
        const response = new Response(JSON.stringify(cachedData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        return response
      }

      // Make the actual request
      const response = await baseFetch(input, init)

      if (response.ok) {
        // Clone the response so we can read it and still return it
        const clonedResponse = response.clone()
        try {
          const json = await clonedResponse.json()
          cache.apiRequests.set(cacheKey, json)
        } catch {
          // If response is not JSON, don't cache it
        }
      }

      return response
    }

    // For non-GET requests or when cache is not explicitly enabled, just forward the request
    return baseFetch(input, init)
  }
}
