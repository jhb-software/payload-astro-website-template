import { WEBSITE_URL } from 'astro:env/client'
import type { Author, Media, Post } from 'cms/src/payload-types'
import type { Article as SchemaArticle, WithContext } from 'schema-dts'
import { authorSchema } from './author'
import { organizationSchema } from './organization'

export const postSchema = (post: Post, locale: string): WithContext<SchemaArticle> => {
  const authors = Array.isArray(post.authors) ? (post.authors as Author[]) : []

  const authorSchemas = authors.map((author) => authorSchema(author))

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: (post.image as Media)?.url ?? undefined,
    author: authorSchemas.length === 1 ? authorSchemas[0] : authorSchemas,
    publisher: organizationSchema(),
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    url: new URL(post.path, WEBSITE_URL).toString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(post.path, WEBSITE_URL).toString(),
    },
    inLanguage: locale,
  }
}
