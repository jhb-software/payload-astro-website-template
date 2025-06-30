import AuthorsBlock from '@/blocks/AuthorsBlock'
import BlogPostsBlock from '@/blocks/BlogPostsBlock'
import RichTextBlock from '@/blocks/RichTextBlock'
import { heroSection } from '@/fields/heroSection'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { createPageCollectionConfig } from '@jhb.software/payload-pages-plugin'
import { CollectionConfig } from 'payload'

const Pages: CollectionConfig = createPageCollectionConfig({
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'status', 'updatedAt'],
    group: CollectionGroups.PagesCollections,
  },
  versions: {
    drafts: true,
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  page: {
    parent: {
      collection: 'pages',
      name: 'parent',
    },
    isRootCollection: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    heroSection(),
    {
      name: 'sections',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'subTitle',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'highlightBackground',
          type: 'checkbox',
        },
        {
          name: 'blocks',
          type: 'blocks',
          blocks: [RichTextBlock, BlogPostsBlock, AuthorsBlock],
        },
      ],
    },
  ],
})

export default Pages
