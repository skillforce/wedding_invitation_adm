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

let _onRefresh: (() => Promise<string>) | null = null
let _onUnauthorized: (() => Promise<void>) | null = null
let _refreshPromise: Promise<string> | null = null

export function configureApiAuth(
  onRefresh: () => Promise<string>,
  onUnauthorized: () => Promise<void>,
): void {
  _onRefresh = onRefresh
  _onUnauthorized = onUnauthorized
}

function doRefresh(): Promise<string> {
  if (!_refreshPromise) {
    _refreshPromise = _onRefresh!().finally(() => {
      _refreshPromise = null
    })
  }
  return _refreshPromise
}

function buildHeaders(token: string, extra?: HeadersInit): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(extra ?? {}),
  }
}

export async function apiFetch(path: string, options: RequestInit = {}, authToken?: string | null): Promise<Response> {
  const token = authToken ?? localStorage.getItem('token')
  if (!token) throw new Error('errors.auth.unauthorized')

  const response = await fetch(`${BASE_API_URL}${path}`, {
    ...options,
    headers: buildHeaders(token, options.headers),
  })

  if (response.status === 401 && _onRefresh) {
    try {
      const newToken = await doRefresh()
      return fetch(`${BASE_API_URL}${path}`, {
        ...options,
        headers: buildHeaders(newToken, options.headers),
      })
    } catch {
      await _onUnauthorized?.()
      throw new Error('errors.auth.unauthorized')
    }
  }

  return response
}
