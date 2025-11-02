import type { Author, Config, Page, Post } from 'cms/src/payload-types'

export type CMSConfig = Config
export type Locale = Config['locale']

export type PageData = Page | Post | Author
