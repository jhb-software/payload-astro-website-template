import type { ApplyDisableErrors, SelectType } from 'payload'

import { cache } from '../cache'
import type { PayloadSDK } from '../sdk'
import type {
  CollectionSlug,
  JoinQuery,
  PayloadGeneratedTypes,
  PopulateType,
  TransformCollectionWithSelect,
  TypedLocale,
} from '../types'

export type FindByIDOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TDisableErrors extends boolean,
  TSelect extends SelectType,
> = {
  collection: TSlug
  depth?: number
  disableErrors?: TDisableErrors
  draft?: boolean
  fallbackLocale?: false | TypedLocale<T>
  id: number | string
  joins?: JoinQuery<T, TSlug>
  locale?: 'all' | TypedLocale<T>
  populate?: PopulateType<T>
  select?: TSelect
}

export async function findByID<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TDisableErrors extends boolean,
  TSelect extends SelectType,
>(
  sdk: PayloadSDK<T>,
  options: FindByIDOptions<T, TSlug, TDisableErrors, TSelect>,
  useCache: boolean,
  init?: RequestInit,
): Promise<ApplyDisableErrors<TransformCollectionWithSelect<T, TSlug, TSelect>, TDisableErrors>> {
  try {
    const path = `/${options.collection}/${options.id}`

    const cacheKey = path + JSON.stringify(options)
    if (useCache) {
      const data = cache.apiRequests.get(cacheKey)

      if (data) {
        return data as ApplyDisableErrors<
          TransformCollectionWithSelect<T, TSlug, TSelect>,
          TDisableErrors
        >
      }
    }

    const response = await sdk.request({
      args: options,
      init,
      method: 'GET',
      path,
    })

    if (response.ok) {
      const json = await response.json()

      if (useCache) {
        cache.apiRequests.set(cacheKey, json)
      }

      return json
    } else {
      throw new Error()
    }
  } catch {
    if (options.disableErrors) {
      // @ts-expect-error generic nullable
      return null
    }

    throw new Error(`Error retrieving the document ${options.collection}/${options.id}`)
  }
}
