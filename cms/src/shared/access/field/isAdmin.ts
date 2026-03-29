import type { FieldAccess } from 'payload'

export const isAdmin: FieldAccess = ({ req: { user } }): boolean => {
  return Boolean(user && user.collection === 'users' && user.roles.includes('admin'))
}
