import { isAdmin } from '@/shared/access/field/isAdmin'
import { isAdmin as isAdminAccess } from '@/shared/access/isAdmin'
import { isSelfOrAdmin } from '@/shared/access/isSelfOrAdmin'
import { CollectionGroups } from '@/shared/CollectionGroups'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'roles'],
    listSearchableFields: ['email', 'firstName', 'lastName'],
    group: CollectionGroups.SystemCollections,
  },
  auth: true,
  access: {
    read: isSelfOrAdmin,
    update: isSelfOrAdmin,
    delete: isAdminAccess,
    create: isAdminAccess,
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
    {
      name: 'roles',
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      required: true,
      access: {
        create: isAdmin,
        update: isAdmin,
      },
      options: [
        // Editors can read, create, update and delete content
        {
          label: 'Editor',
          value: 'editor',
        },
        // Admins add or delete users
        {
          label: 'Admin',
          value: 'admin',
        },
        // Developers can see additional debug information
        {
          label: 'Developer',
          value: 'developer',
        },
      ],
    },
  ],
}
