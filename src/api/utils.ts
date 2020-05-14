import { API_BASE_URI } from './constants'

export const toPath = (path?: string | null): string => {
  return API_BASE_URI + (path ? path.replace(/^(\w)/, '/$1') : '')
}
