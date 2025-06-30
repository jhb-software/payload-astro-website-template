import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { createRedirectsCollectionConfig } from '@jhb.software/payload-pages-plugin'

export const Redirects = createRedirectsCollectionConfig({
  overrides: {
    admin: {
      group: CollectionGroups.SystemCollections,
    },
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  // the fields are defined by the plugin
})
