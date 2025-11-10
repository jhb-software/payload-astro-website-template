import CodeBlock from '@/blocks/CodeBlock'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { BlocksFeature } from 'node_modules/@payloadcms/richtext-lexical/dist/features/blocks/server'

const Posts: PageCollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'updatedAt', 'status'],
    group: CollectionGroups.PagesCollections,
  },
  versions: {
    drafts: true,
  },
  page: {
    parent: {
      collection: 'pages',
      name: 'parent',
      sharedDocument: true,
    },
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  defaultPopulate: {
    // only populate the fields that are required by the frontend (e.g. for post cards and list views)
    path: true,
    title: true,
    excerpt: true,
    image: true,
    authors: true,
    createdAt: true,
    updatedAt: true,
  },
  fields: [
    // Sidebar fields:
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      hasMany: true,
      minRows: 1,
      admin: {
        position: 'sidebar',
      },
    },
    // Body fields:
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({
            blocks: [CodeBlock],
          }),
        ],
      }),
    },
  ],
}

export default Posts
