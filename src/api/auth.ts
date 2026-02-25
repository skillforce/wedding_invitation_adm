import { BASE_API_URL, apiFetch } from '@/api/consts'

export interface AuthDto {
  login: string
  password: string
}

export interface AuthResponseDto {
  accessToken: string
}

export interface MeResponseDto {
  id: number
  login: string
}

export const AUTH_API = {
  async login(authDto: AuthDto): Promise<AuthResponseDto> {
    const response = await fetch(`${BASE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authDto),
    })

    if (!response.ok) {
      throw new Error('errors.auth.invalidCredentials')
    }

    const payload = (await response.json()) as Partial<AuthResponseDto>
    if (!payload.accessToken) {
      throw new Error('errors.auth.noAccessToken')
    }

    return { accessToken: payload.accessToken }
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

    return { id: payload.id, login: payload.login }
  },
}
