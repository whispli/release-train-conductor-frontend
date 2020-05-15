export const toPath = (path?: string | null): string => {
  return process.env.VUE_APP_API_PREFIX + (path ? path.replace(/^(\w)/, '/$1') : '')
}
