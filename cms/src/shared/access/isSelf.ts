import type { Access } from 'payload'

export const isSelf: Access = ({ req: { user }, id }): boolean => {
  return Boolean(user && user.id === id)
}
