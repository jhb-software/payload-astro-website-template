import type { Access, AccessArgs } from 'payload'

export const isEditor: Access = ({ req: { user } }: AccessArgs): boolean => {
  return Boolean(user && user.collection === 'users' && user.roles.includes('editor'))
}
