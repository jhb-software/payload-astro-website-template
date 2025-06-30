import type { PaginatedDocs, SelectType, Sort, Where } from 'payload'

import { cache } from '../cache'
import type { PayloadSDK } from '../sdk'
import type {
  CollectionSlug,
  JoinQuery,
  PayloadGeneratedTypes,
  PopulateType,
  TransformCollectionWithSelect,
  TypedLocale,
} from '../types.js'

export type FindOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
> = {
  collection: TSlug
  depth?: number
  draft?: boolean
  fallbackLocale?: false | TypedLocale<T>
  joins?: JoinQuery<T, TSlug>
  limit?: number
  locale?: 'all' | TypedLocale<T>
  page?: number
  populate?: PopulateType<T>
  select?: TSelect
  sort?: Sort
  where?: Where
  pagination?: boolean
}

export async function find<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
>(
  sdk: PayloadSDK<T>,
  options: FindOptions<T, TSlug, TSelect>,
  useCache: boolean,
  init?: RequestInit,
): Promise<PaginatedDocs<TransformCollectionWithSelect<T, TSlug, TSelect>>> {
  const path = `/${options.collection}`

  const cacheKey = path + JSON.stringify(options)
  if (useCache) {
    const data = cache.apiRequests.get(cacheKey)

    if (data) {
      return data as PaginatedDocs<TransformCollectionWithSelect<T, TSlug, TSelect>>
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
