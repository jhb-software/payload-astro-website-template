import { WEBSITE_URL } from 'astro:env/client'
import type { Author, Media } from 'cms/src/payload-types'
import type { Person, WithContext } from 'schema-dts'

export const authorSchema = (author: Author): WithContext<Person> => {
  const photoUrl = (author.photo as Media)?.url

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.profession,
    description: author.excerpt,
    image: photoUrl ?? undefined,
    url: new URL(author.path, WEBSITE_URL).toString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(author.path, WEBSITE_URL).toString(),
    },
  }
}
