import { HttpMethod, apiFetch, parseApiError } from '@/api/consts'

export interface GuestResponseViewDto {
  id: number
  preferred_drinks: string[]
  other_preferences?: string
  plus_one: boolean
  plus_one_name?: string
}

export interface GuestDetailViewDto {
  id: number
  name: string
  is_already_answered: boolean
  response?: GuestResponseViewDto
}

export interface CreateGuestInputDto {
  guest_name: string
  user_id: number
}

export const GUESTS_API = {
  async getAllGuests(): Promise<GuestDetailViewDto[]> {
    const res = await apiFetch('/guests')
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async createGuest(dto: CreateGuestInputDto): Promise<GuestDetailViewDto> {
    const res = await apiFetch('/guests', {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deleteGuest(id: number): Promise<void> {
    const res = await apiFetch(`/guests/${id}`, { method: HttpMethod.DELETE })
    if (!res.ok) throw await parseApiError(res)
  },
}