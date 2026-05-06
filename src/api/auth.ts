import { BASE_API_URL, apiFetch, parseApiError } from '@/api/consts'
import { DEVICE_ID_KEY } from '@/constants/app'
import { v4 as uuidv4 } from 'uuid';


function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

function saveDeviceId(id: string): void {
  localStorage.setItem(DEVICE_ID_KEY, id)
}

export interface AuthDto {
  login: string
  password: string
}

export interface ProfileDto {
  invitationUrl: string | null
  profileImg: string | null
  weddingDate: string | null
  email: string | null
  isSuperUser: boolean
  isCreatedBySuperUser: boolean
  isConfirmed: boolean
}

export interface MeResponseDto {
  id: number
  login: string
  profile: ProfileDto
}

export interface LoginResponseDto extends MeResponseDto {
  accessToken: string
}

const DEFAULT_PROFILE: ProfileDto = {
  invitationUrl: null,
  profileImg: null,
  weddingDate: null,
  email: null,
  isSuperUser: false,
  isCreatedBySuperUser: false,
  isConfirmed: true,
}

export const AUTH_API = {
  async login(authDto: AuthDto): Promise<LoginResponseDto> {
    const deviceId = getOrCreateDeviceId()
    const response = await fetch(`${BASE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Device-Id': deviceId },
      body: JSON.stringify(authDto),
      credentials: 'include',
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }

    const payload = (await response.json()) as Partial<LoginResponseDto & { deviceId: string }>
    if (!payload.accessToken || typeof payload.id !== 'number' || typeof payload.login !== 'string') {
      throw new Error('errors.auth.noAccessToken')
    }

    if (payload.deviceId) {
      saveDeviceId(payload.deviceId)
    }

    return {
      accessToken: payload.accessToken,
      id: payload.id,
      login: payload.login,
      profile: payload.profile ?? DEFAULT_PROFILE,
    }
  },

  async refresh(): Promise<string> {
    const deviceId = getOrCreateDeviceId()
    const response = await fetch(`${BASE_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'X-Device-Id': deviceId },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('errors.auth.unauthorized')
    }

    const payload = (await response.json()) as Partial<{ accessToken: string }>
    if (!payload.accessToken) {
      throw new Error('errors.auth.noAccessToken')
    }

    return payload.accessToken
  },

  async logout(): Promise<void> {
    await fetch(`${BASE_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  },

  async confirmEmail(token: string, password: string): Promise<void> {
    const response = await fetch(`${BASE_API_URL}/auth/confirm-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    if (!response.ok) {
      throw await parseApiError(response)
    }
  },

  async me(token?: string): Promise<MeResponseDto> {
    const response = await apiFetch('/auth/me', {}, token)

    if (!response.ok) {
      throw new Error('errors.auth.unauthorized')
    }

    const payload = (await response.json()) as Partial<MeResponseDto>

    if (typeof payload.id !== 'number' || typeof payload.login !== 'string') {
      throw new Error('errors.auth.invalidMeResponse')
    }

    return {
      id: payload.id,
      login: payload.login,
      profile: payload.profile ?? DEFAULT_PROFILE,
    }
  },
}
