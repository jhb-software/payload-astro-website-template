import type { Access, AccessArgs } from 'payload'

export const isDeveloper: Access = ({ req: { user } }: AccessArgs): boolean => {
  return Boolean(user && user.roles.includes('developer'))
}
