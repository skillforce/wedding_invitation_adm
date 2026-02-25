import { apiFetch, parseApiError } from '@/api/consts'

export interface GuestsViewDto {
  id: number
  name: string
  preferred_drinks: string[]
  other_preferences?: string
}

export const GUESTS_API = {
  async getAllGuests(): Promise<GuestsViewDto[]> {
    const res = await apiFetch('/guests')
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },
}