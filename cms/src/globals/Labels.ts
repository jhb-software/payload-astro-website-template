import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { GlobalConfig, TextField } from 'payload'

const labelField = (name: string, label?: string): TextField => ({
  name,
  type: 'text',
  required: true,
  localized: true,
  label: label,
})

/** Global document that contains labels that should be changable via the CMS. (e.g. aria labels or global button labels) */
const Labels: GlobalConfig = {
  slug: 'labels',
  // ensure payload wont convert the slug to be singular
  dbName: 'labels',
  typescript: {
    interface: 'Labels',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'group',
      name: 'global',
      fields: [
        labelField('show-more'),
        labelField('learn-more'),
        labelField('open-menu'),
        labelField('close-menu'),
      ],
    },
    {
      type: 'group',
      name: 'posts',
      fields: [labelField('written-by'), labelField('last-updated-at')],
    },
    {
      type: 'group',
      name: 'not-found-page',
      label: 'Not found (404) page',
      fields: [
        labelField('title', 'Title'),
        labelField('description', 'Description'),
        labelField('home-page-button', 'Home page button'),
      ],
    },
  ],
}

export default Labels
