export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const BASE_API_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  serverMessage: string
  constructor(serverMessage: string) {
    super('ApiError')
    this.serverMessage = serverMessage
  }
}

export async function parseApiError(response: Response): Promise<ApiError> {
  try {
    const body = await response.json()
    const message = body?.errorsMessages?.[0]?.message ?? body?.message ?? ''
    return new ApiError(typeof message === 'string' ? message : '')
  } catch {
    return new ApiError('')
  }
}

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
