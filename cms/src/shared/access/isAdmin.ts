import type { Access, AccessArgs } from 'payload'

export const isAdmin: Access = ({ req: { user } }: AccessArgs): boolean => {
  return Boolean(user && user.roles.includes('admin'))
}
