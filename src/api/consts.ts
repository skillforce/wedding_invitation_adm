import { markOffline, markOnline } from '@/utils/networkStatus'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
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

function buildHeaders(token: string, body: BodyInit | null | undefined, extra?: HeadersInit): HeadersInit {
  const base: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }
  if (!(body instanceof FormData)) {
    base['Content-Type'] = 'application/json'
  }
  return { ...base, ...(extra ?? {}) }
}

const API_TIMEOUT_MS = 7_000

function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => {
      controller.abort()
      reject(new Error('errors.network.timeout'))
    }, API_TIMEOUT_MS),
  )
  return Promise.race([fetch(url, { ...options, signal: controller.signal }), timeout])
}

export function qs(userId?: number): string {
  return userId ? `?userId=${userId}` : ''
}

export async function apiFetch(path: string, options: RequestInit = {}, authToken?: string | null): Promise<Response> {
  const token = authToken ?? localStorage.getItem('token')
  if (!token) throw new Error('errors.auth.unauthorized')

  const url = `${BASE_API_URL}${path}`

  let response: Response
  try {
    response = await fetchWithTimeout(url, {
      ...options,
      headers: buildHeaders(token, options.body, options.headers),
    })
    markOnline()
  } catch (err) {
    markOffline()
    throw err
  }

  if (response.status === 401 && _onRefresh) {
    try {
      const newToken = await doRefresh()
      try {
        const refreshedResponse = await fetchWithTimeout(url, {
          ...options,
          headers: buildHeaders(newToken, options.body, options.headers),
        })
        markOnline()
        return refreshedResponse
      } catch (err) {
        markOffline()
        throw err
      }
    } catch {
      await _onUnauthorized?.()
      throw new Error('errors.auth.unauthorized')
    }
  }

  return response
}
