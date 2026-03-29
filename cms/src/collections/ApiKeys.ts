import { isAdmin } from '@/shared/access/isAdmin'
import { isSelfOrAdmin } from '@/shared/access/isSelfOrAdmin'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { CollectionConfig } from 'payload'

const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  labels: {
    singular: 'API Key',
    plural: 'API Keys',
  },
  admin: {
    useAsTitle: 'type',
    group: CollectionGroups.SystemCollections,
  },
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true,
  },
  access: {
    create: isAdmin,
    read: isSelfOrAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Agent', value: 'agent' },
      ],
    },
  ],
}

export default ApiKeys
