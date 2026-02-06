import type { NestedKeysStripped } from '@payloadcms/translations'

export const customTranslations = {
  de: {
    section: 'Abschnitt',
    unlabelled: 'Unbeschriftet',
    untitled: 'Unbenannt',
  },
  en: {
    section: 'Section',
    unlabelled: 'Unlabelled',
    untitled: 'Untitled',
  },
}

export type CustomTranslationsObject = typeof customTranslations.en
export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>
