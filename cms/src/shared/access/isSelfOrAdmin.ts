import type { Access, AccessArgs } from 'payload'

import { isAdmin } from './field/isAdmin'
import { isSelf } from './isSelf'

export const isSelfOrAdmin: Access = ({ id, req }: AccessArgs): boolean => {
  return Boolean(isSelf({ id, req }) || isAdmin({ req }))
}
