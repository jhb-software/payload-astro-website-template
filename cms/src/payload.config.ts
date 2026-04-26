import {
  openAIResolver as altTextOpenAIResolver,
  payloadAltTextPlugin,
} from '@jhb.software/payload-alt-text-plugin'
import { alternatePathsField, payloadPagesPlugin } from '@jhb.software/payload-pages-plugin'
import { vercelDeploymentsPlugin } from '@jhb.software/payload-vercel-deployments'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { FixedToolbarFeature, lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { attachDatabasePool } from '@vercel/functions'
import path from 'path'
import { buildConfig, CollectionConfig, CollectionSlug } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import CodeBlock from './blocks/CodeBlock'
import ApiKeys from './collections/ApiKeys'
import Authors from './collections/Authors'
import { generateFileURL, Media } from './collections/Media'
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
import type { Media as MediaType } from './payload-types'

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
  ApiKeys,
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
    dashboard: {
      defaultLayout: [
        { widgetSlug: 'vercel-deployments', width: 'medium' },
        { widgetSlug: 'alt-text-health', width: 'medium' },
      ],
      widgets: [],
    },
  },
  globals: [Header, Footer, Labels],
  collections: collections,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((feature) => feature.key !== 'relationship'),
      FixedToolbarFeature(),
      LinkFeature({ enabledCollections: pageCollectionsSlugs }),
    ],
  }),
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
    payloadAltTextPlugin({
      collections: [Media.slug as CollectionSlug],
      resolver: altTextOpenAIResolver({
        apiKey: process.env.OPENAI_API_KEY!,
        model: 'gpt-4.1-mini',
      }),
      getImageThumbnail: (doc: Record<string, unknown>) => {
        const media = doc as unknown as MediaType

        if (!media.url) {
          throw new Error('URL not found. Could not return image thumbnail.')
        }

        // use sm if possible to reduce token count and speed up the generation of the alt text
        return 'sizes' in media
          ? (media.sizes?.sm?.url ?? media.sizes?.md?.url ?? media.sizes?.lg?.url ?? media.url!)
          : media.url!
      },
    }),
    vercelDeploymentsPlugin({
      vercel: {
        apiToken: process.env.VERCEL_API_TOKEN!,
        projectId: process.env.FRONTEND_VERCEL_PROJECT_ID!,
        teamId: process.env.FRONTEND_VERCEL_TEAM_ID,
      },
      widget: {
        websiteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
      },
    }),
    seoPlugin({
      collections: pageCollectionsSlugs,
      uploadsCollection: 'media',
      generateURL: ({ doc }) => generatePageURL({ path: doc.path, preview: false }) ?? '',
      generateTitle: ({ doc }) => `${doc.title} - ${websiteName}`,
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'noIndex',
          type: 'checkbox',
          index: true,
          defaultValue: false,
          admin: {
            description:
              'If checked, a noindex meta tag will be added to the page and it will be excluded from the sitemap.',
          },
        },
        alternatePathsField(),
      ],
      interfaceName: 'SeoMetadata',
    }),
    s3Storage({
      collections: {
        media: {
          // serve files directly from S3 object storage to improve performance.
          // The frontend proxies these via /media/* with cache-control headers (see web/vercel.json).
          disablePayloadAccessControl: true,
          generateFileURL,
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      },
      clientUploads: true,
      acl: 'public-read',
    }),
  ],
  // Uncomment the following line to seed the CMS with default data
  // onInit: async (payload) => {
  //  await seedCMS(payload)
  //},
})
