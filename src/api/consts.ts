

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}


export const BASE_API_URL = import.meta.env.VITE_APP_API_URL ?? ''

export const BASE_REQUEST_CONFIG: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
}
