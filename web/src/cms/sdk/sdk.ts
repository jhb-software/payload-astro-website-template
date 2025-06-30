import type { ApplyDisableErrors, PaginatedDocs, SelectType } from 'payload'
import { type OperationArgs, buildSearchParams } from './buildSearchParams'
import { type FindOptions, find } from './collections/find'
import { type FindByIDOptions, findByID } from './collections/findById'
import { type FindGlobalOptions, findGlobal } from './globals/findOne'
import type {
  CollectionSlug,
  GlobalSlug,
  PayloadGeneratedTypes,
  SelectFromGlobalSlug,
  TransformCollectionWithSelect,
  TransformGlobalWithSelect,
} from './types'

type Args = {
  /** Base passed `RequestInit` to `fetch`. For base headers / credentials include etc. */
  baseInit?: RequestInit

  /**
   * Base API URL for requests.
   * @example 'https://example.com/api'
   */
  baseURL: string

  /**
   * This option allows you to pass a custom `fetch` implementation.
   * The function always receives `path` as the first parameter and `RequestInit` as the second.
   * @example For testing without needing an HTTP server:
   * ```typescript
   * import type { GeneratedTypes, SanitizedConfig } from 'payload';
   * import config from '@payload-config';
   * import { REST_DELETE, REST_GET, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes';
   * import { PayloadSDK } from '@payloadcms/sdk';
   *
   * export type TypedPayloadSDK = PayloadSDK<GeneratedTypes>;
   *
   * const api = {
   *   GET: REST_GET(config),
   *   POST: REST_POST(config),
   *   PATCH: REST_PATCH(config),
   *   DELETE: REST_DELETE(config),
   *   PUT: REST_PUT(config),
   * };
   *
   * const awaitedConfig = await config;
   *
   * export const sdk = new PayloadSDK<GeneratedTypes>({
   *   baseURL: '',
   *   fetch: (path: string, init: RequestInit) => {
   *     const [slugs, search] = path.slice(1).split('?');
   *     const url = `${awaitedConfig.serverURL || 'http://localhost:3000'}${awaitedConfig.routes.api}/${slugs}${search ? `?${search}` : ''}`;
   *
   *     if (init.body instanceof FormData) {
   *       const file = init.body.get('file') as Blob;
   *       if (file && init.headers instanceof Headers) {
   *         init.headers.set('Content-Length', file.size.toString());
   *       }
   *     }
   *
   *     const request = new Request(url, init);
   *
   *     const params = {
   *       params: Promise.resolve({
   *         slug: slugs.split('/'),
   *       }),
   *     };
   *
   *     return api[init.method.toUpperCase()](request, params);
   *   },
   * });
   * ```
   */
  fetch?: typeof fetch
}

export class PayloadSDK<T extends PayloadGeneratedTypes = PayloadGeneratedTypes> {
  baseInit: RequestInit

  baseURL: string

  fetch: typeof fetch
  constructor(args: Args) {
    this.baseURL = args.baseURL
    this.fetch = args.fetch ?? globalThis.fetch
    this.baseInit = args.baseInit ?? {}
  }

  /**
   * @description Find documents with criteria
   * @param options
   * @returns documents satisfying query
   */
  find<TSlug extends CollectionSlug<T>, TSelect extends SelectType>(
    options: FindOptions<T, TSlug, TSelect>,
    useCache: boolean,
    init?: RequestInit,
  ): Promise<PaginatedDocs<TransformCollectionWithSelect<T, TSlug, TSelect>>> {
    return find(this, options, useCache, init)
  }

  /**
   * @description Find document by ID
   * @param options
   * @returns document with specified ID
   */
  findByID<
    TSlug extends CollectionSlug<T>,
    TDisableErrors extends boolean,
    TSelect extends SelectType,
  >(
    options: FindByIDOptions<T, TSlug, TDisableErrors, TSelect>,
    useCache: boolean,
    init?: RequestInit,
  ): Promise<ApplyDisableErrors<TransformCollectionWithSelect<T, TSlug, TSelect>, TDisableErrors>> {
    return findByID(this, options, useCache, init)
  }

  findGlobal<TSlug extends GlobalSlug<T>, TSelect extends SelectFromGlobalSlug<T, TSlug>>(
    options: FindGlobalOptions<T, TSlug, TSelect>,
    useCache: boolean,
    init?: RequestInit,
  ): Promise<TransformGlobalWithSelect<T, TSlug, TSelect>> {
    return findGlobal(this, options, useCache, init)
  }

  async request({
    args = {},
    file,
    init: incomingInit,
    json,
    method,
    path,
  }: {
    args?: OperationArgs
    file?: Blob
    init?: RequestInit
    json?: unknown
    method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
    path: string
  }): Promise<Response> {
    const headers = new Headers({ ...this.baseInit.headers, ...incomingInit?.headers })

    const init: RequestInit = {
      method,
      ...this.baseInit,
      ...incomingInit,
      headers,
    }

    if (json) {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('_payload', JSON.stringify(json))
        init.body = formData
      } else {
        headers.set('Content-Type', 'application/json')
        init.body = JSON.stringify(json)
      }
    }

    const response = await this.fetch(`${this.baseURL}${path}${buildSearchParams(args)}`, init)

    return response
  }
}
