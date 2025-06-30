export interface LexicalNode {
  type: string
  indent: number
  version: number
  children?: LexicalNode[]
  direction?: 'ltr' | 'rtl'
  detail?: number
}

// https://github.com/payloadcms/payload/blob/main/packages/richtext-lexical/src/features/link/nodes/types.ts
export interface LinkNode extends LexicalNode {
  type: 'link' | 'autolink'
  fields: LinkFields
}

// https://github.com/payloadcms/payload/blob/main/packages/richtext-lexical/src/features/link/nodes/types.ts
export interface LinkFields {
  doc: {
    relationTo: string
    value:
      | {
          // Actual doc data, populated in afterRead hook
          [key: string]: unknown
          id: string
          slug?: string
          path?: string
        }
      | string // ID of the doc
  } | null
  linkType: 'custom' | 'internal'
  newTab: boolean
  url: string
}

export interface HeadingNode extends LexicalNode {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export interface ParagraphNode extends LexicalNode {
  type: 'paragraph'
  format: 'justify' | 'left' | 'right' | 'center'
}

export interface TextNode extends LexicalNode {
  type: 'text'
  text: string
  style?: string
  mode?: 'normal' | string
  format: number
}

// https://lexical.dev/docs/api/modules/lexical_list
export interface ListNode extends LexicalNode {
  type: 'list'
  listType: 'number' | 'bullet' | 'check'
  tag: 'ul' | 'ol'
}

// https://lexical.dev/docs/api/classes/lexical_list.ListItemNode
export interface ListItemNode extends LexicalNode {
  type: 'listItem'
  checked?: boolean
}

export interface BlockNode extends LexicalNode {
  fields: {
    id: string
    blockName: string
    blockType: string
    [key: string]: unknown
  }
}

// https://github.com/payloadcms/payload/blob/main/packages/richtext-lexical/src/field/features/Upload/nodes/UploadNode.tsx
export interface UploadNode extends LexicalNode {
  type: 'upload'
  relationTo: string // media collection name
  value: {
    // Actual upload data, populated in afterRead hook
    [key: string]: unknown
    id: string
    width: number
    height: number
    url: string
    alt: string
    filename: string
  }
}
