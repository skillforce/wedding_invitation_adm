import { apiFetch } from '@/api/consts'

export interface GuestsViewDto {
  id: number
  name: string
  preferred_drinks: string[]
  other_preferences?: string
}

export const GUESTS_API = {
  async getAllGuests(): Promise<GuestsViewDto[]> {
    const res = await apiFetch('/guests')
    if (!res.ok) throw new Error('errors.guests.failedToLoad')
    return res.json()
  },
}
