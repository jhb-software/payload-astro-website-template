import type { Access } from 'payload'

export const isSelf: Access = ({ id, req: { user } }): boolean => {
  return Boolean(user && user.id === id)
}
