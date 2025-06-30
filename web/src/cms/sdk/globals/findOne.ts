import type { SelectType } from 'payload'

import { cache } from '../cache'
import type { PayloadSDK } from '../sdk'
import type {
  GlobalSlug,
  PayloadGeneratedTypes,
  PopulateType,
  SelectFromGlobalSlug,
  TransformGlobalWithSelect,
  TypedLocale,
} from '../types'

export type FindGlobalOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TSelect extends SelectType,
> = {
  depth?: number
  draft?: boolean
  fallbackLocale?: false | TypedLocale<T>
  locale?: 'all' | TypedLocale<T>
  populate?: PopulateType<T>
  select?: TSelect
  slug: TSlug
}

export async function findGlobal<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TSelect extends SelectFromGlobalSlug<T, TSlug>,
>(
  sdk: PayloadSDK<T>,
  options: FindGlobalOptions<T, TSlug, TSelect>,
  useCache: boolean,
  init?: RequestInit,
): Promise<TransformGlobalWithSelect<T, TSlug, TSelect>> {
  const path = `/globals/${options.slug}`

  const cacheKey = path + JSON.stringify(options)
  if (useCache) {
    const data = cache.apiRequests.get(cacheKey)

    if (data) {
      return data as TransformGlobalWithSelect<T, TSlug, TSelect>
    }
  }

  const response = await sdk.request({
    args: options,
    init,
    method: 'GET',
    path,
  })
  const json = await response.json()

  if (useCache) {
    cache.apiRequests.set(cacheKey, json)
  }

  return json
}
