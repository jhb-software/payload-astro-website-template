import { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      name: 'text',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}

export default RichTextBlock
