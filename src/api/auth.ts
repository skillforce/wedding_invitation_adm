import { BASE_API_URL, BASE_REQUEST_CONFIG, HttpMethod } from '@/api/consts'

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
      ...BASE_REQUEST_CONFIG,
      method: HttpMethod.POST,
      body: JSON.stringify(authDto),
    })

    if (!response.ok) {
      throw new Error('Login or Password are wrong')
    }

    const payload = (await response.json()) as Partial<AuthResponseDto>
    if (!payload.accessToken) {
      throw new Error('No access token in auth response')
    }

    return { accessToken: payload.accessToken }
  },

  async me(token: string): Promise<MeResponseDto> {
    const response = await fetch(`${BASE_API_URL}/auth/me`, {
      ...BASE_REQUEST_CONFIG,
      method: HttpMethod.GET,
      headers: {
        ...BASE_REQUEST_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Unauthorized')
    }

    const payload = (await response.json()) as Partial<MeResponseDto>

    if (typeof payload.id !== 'number' || typeof payload.login !== 'string') {
      throw new Error('Invalid /auth/me response')
    }

    return {
      id: payload.id,
      login: payload.login,
    }
  },
}
