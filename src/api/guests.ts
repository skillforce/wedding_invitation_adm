import { BASE_API_URL, BASE_REQUEST_CONFIG, HttpMethod } from '@/api/consts'

export interface GuestsViewDto {
  id: number
  name: string
  preferred_drinks: string[]
  other_preferences?: string
}

export const GUESTS_API = {
  async getAllGuests(token: string): Promise<GuestsViewDto[]> {
    const response = await fetch(`${BASE_API_URL}/guests`, {
      ...BASE_REQUEST_CONFIG,
      method: HttpMethod.GET,
      headers: {
        ...(BASE_REQUEST_CONFIG.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to load guests')
    }

    return (await response.json()) as GuestsViewDto[]
  },
}
