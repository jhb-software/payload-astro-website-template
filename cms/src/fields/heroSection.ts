import { Field } from 'payload'

export function heroSection(): Field {
  return {
    name: 'hero',
    type: 'group',
    interfaceName: 'HeroSection',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        localized: true,
      },
      {
        name: 'subtitle',
        type: 'textarea',
        localized: true,
        required: true,
      },
    ],
  }
}
