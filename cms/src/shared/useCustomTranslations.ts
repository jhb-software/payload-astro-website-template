import { useTranslation } from '@payloadcms/ui'

import { CustomTranslationsKeys, CustomTranslationsObject } from './customTranslations'

export const useCustomTranslations = () =>
  useTranslation<CustomTranslationsObject, CustomTranslationsKeys>()
