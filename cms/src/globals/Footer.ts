import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { GlobalConfig } from 'payload'

const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'array',
      name: 'links',
      maxRows: 6,
      fields: [
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}

export default Footer
