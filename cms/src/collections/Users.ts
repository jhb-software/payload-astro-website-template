import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role'],
    listSearchableFields: ['email', 'firstName', 'lastName'],
    group: CollectionGroups.SystemCollections,
  },
  auth: true,
  access: {
    read: authenticated,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  fields: [
    // Email field is added by default
    {
      name: 'firstName',
      required: true,
      type: 'text',
    },
    {
      name: 'lastName',
      required: true,
      type: 'text',
    },
  ],
}
