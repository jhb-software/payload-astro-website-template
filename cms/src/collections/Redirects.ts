import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { RedirectsCollectionConfig } from '@jhb.software/payload-pages-plugin'

export const Redirects: RedirectsCollectionConfig = {
  slug: 'redirects',
  admin: {
    group: CollectionGroups.SystemCollections,
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  redirects: {},
  // fields are managed by the plugin
  fields: [],
}
