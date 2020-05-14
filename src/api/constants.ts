export const API_BASE_URI: string =
  `${process.env.VUE_APP_API_PROTOCOL}${process.env.VUE_APP_API_HOST}:${process.env.VUE_APP_API_PORT}${process.env.VUE_APP_API_PREFIX}`

export const HEADERS = new Headers({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
})

export const DEFAULTS: Partial<RequestInit> = {
  credentials: 'include',
  headers: HEADERS,
  method: 'GET',
}
