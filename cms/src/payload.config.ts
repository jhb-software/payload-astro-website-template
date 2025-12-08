import { alternatePathsField, payloadPagesPlugin } from '@jhb.software/payload-pages-plugin'
import { hetznerStorage } from '@joneslloyd/payload-storage-hetzner'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { attachDatabasePool } from '@vercel/functions'
import { resendAdapter } from '@payloadcms/email-resend'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, CollectionConfig, CollectionSlug } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import CodeBlock from './blocks/CodeBlock'
import Authors from './collections/Authors'
import { Media } from './collections/Media'
import Pages from './collections/Pages'
import Posts from './collections/Posts'
import { Redirects } from './collections/Redirects'
import { Users } from './collections/Users'
import { getGlobalData } from './endpoints/globalData'
import { getPagePropsByPath } from './endpoints/pageProps'
import { getSitemap } from './endpoints/sitemap'
import { getStatisPagesProps } from './endpoints/staticPages'
import Footer from './globals/Footer'
import Header from './globals/Header'
import Labels from './globals/Labels'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const websiteName = 'Payload & Astro Website Template'

export const collections: CollectionConfig[] = [
  // Pages Collections
  Pages,
  Posts,
  Authors,

  // Data Collections
  Media,

  // System Collections
  Redirects,
  Users,
]

export const locales = ['de', 'en']

export const pageCollectionsSlugs: CollectionSlug[] = collections
  .filter((collection) => 'page' in collection && typeof collection.page === 'object')
  .map((collection) => collection.slug as CollectionSlug)

const generatePageURL = ({
  path,
  preview,
}: {
  path: string | null
  preview: boolean
}): string | null => {
  return path && process.env.NEXT_PUBLIC_FRONTEND_URL
    ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}${preview ? '/preview' : ''}${path}`
    : null
}

export default buildConfig({
  localization: {
    locales: locales.map((locale) => ({
      code: locale,
      label: {
        de: 'Deutsch',
        en: 'English',
      }[locale]!,
    })),
    defaultLocale: 'de',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ` - ${websiteName} CMS`,
    },
    components: {
      views: {
        dashboard: {
          Component: '/components/views/DashboardView#DashboardView',
        },
      },
    },
  },
  globals: [Header, Footer, Labels],
  collections: collections,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  csrf:
    process.env.NODE_ENV === 'production'
      ? ['https://cms.your-website.com']
      : ['http://localhost:3000'],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
    // see https://vercel.com/guides/connection-pooling-with-functions
    afterOpenConnection: async (adapter) => attachDatabasePool(adapter.connection.getClient()),
  }),
  email: resendAdapter({
    defaultFromAddress: 'cms@your-website.com',
    defaultFromName: `${websiteName} CMS`,
    apiKey: process.env.RESEND_API_KEY!,
  }),
  endpoints: [
    {
      path: '/static-paths',
      method: 'get',
      handler: getStatisPagesProps,
    },
    {
      path: '/sitemap',
      method: 'get',
      handler: getSitemap,
    },
    {
      path: '/page-props',
      method: 'get',
      handler: getPagePropsByPath,
    },
    {
      path: '/global-data',
      method: 'get',
      handler: getGlobalData,
    },
  ],
  blocks: [
    // Because the CodeBlock is only used inside the RichText editor of the articles, add it here to generate the type
    CodeBlock,
  ],
  sharp,
  plugins: [
    payloadPagesPlugin({
      generatePageURL,
    }),
    seoPlugin({
      collections: pageCollectionsSlugs,
      uploadsCollection: 'media',
      generateURL: ({ doc }) => generatePageURL({ path: doc.path, preview: false }) ?? '',
      generateTitle: ({ doc }) => `${doc.title} - ${websiteName}`,
      fields: ({ defaultFields }) => [...defaultFields, alternatePathsField()],
      interfaceName: 'SeoMetadata',
    }),
    hetznerStorage({
      // ## JUST FOR TESTING, REMOVE BEFORE PUBLISHING:
      disableLocalStorage: false,
      // ##
      collections: {
        media: {
          // serve files directly from hetzner object storage to improve performance
          disablePayloadAccessControl: true,
        },
      },
      bucket: process.env.HETZNER_BUCKET!,
      region: 'nbg1',
      credentials: {
        accessKeyId: process.env.HETZNER_ACCESS_KEY_ID!,
        secretAccessKey: process.env.HETZNER_SECRET_ACCESS_KEY!,
      },
      cacheControl: 'public, max-age=2592000', // max age 30 days
      clientUploads: true,
      acl: 'public-read',
    }),
  ],
  // Uncomment the following line to seed the CMS with default data
  // onInit: async (payload) => {
  //  await seedCMS(payload)
  //},
})
