import type { Access, AccessArgs } from 'payload'

export const isEditor: Access = ({ req: { user } }: AccessArgs): boolean => {
  return Boolean(user && user.roles.includes('editor'))
}
