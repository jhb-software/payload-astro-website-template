import type { Access, AccessArgs } from 'payload'
import { isAdmin } from './field/isAdmin'
import { isSelf } from './isSelf'

export const isSelfOrAdmin: Access = ({ req, id }: AccessArgs): boolean => {
  return Boolean(isSelf({ req, id }) || isAdmin({ req }))
}
