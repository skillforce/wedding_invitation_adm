export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const BASE_API_URL = import.meta.env.VITE_API_URL ?? ''

export async function apiFetch(path: string, options: RequestInit = {}, authToken?: string | null): Promise<Response> {
  const token = authToken ?? localStorage.getItem('token')
  if (!token) throw new Error('errors.auth.unauthorized')

  return fetch(`${BASE_API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
    ...options,
  })
}
