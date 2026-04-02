import { BASE_API_URL, apiFetch, parseApiError } from '@/api/consts'

export interface AuthDto {
  login: string
  password: string
}

export interface ProfileDto {
  invitationUrl: string | null
  profileImg: string | null
  weddingDate: string | null
  phoneNumber: string | null
  email: string | null
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
  phoneNumber: null,
  email: null,
}

export const AUTH_API = {
  async login(authDto: AuthDto): Promise<LoginResponseDto> {
    const response = await fetch(`${BASE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authDto),
      credentials: 'include',
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }

    const payload = (await response.json()) as Partial<LoginResponseDto>
    if (!payload.accessToken || typeof payload.id !== 'number' || typeof payload.login !== 'string') {
      throw new Error('errors.auth.noAccessToken')
    }

    return {
      accessToken: payload.accessToken,
      id: payload.id,
      login: payload.login,
      profile: payload.profile ?? DEFAULT_PROFILE,
    }
  },

  async refresh(): Promise<string> {
    const response = await fetch(`${BASE_API_URL}/auth/refresh`, {
      method: 'POST',
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