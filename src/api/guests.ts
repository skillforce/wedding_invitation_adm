import { HttpMethod, apiFetch, parseApiError } from '@/api/consts'

export interface GuestResponseViewDto {
  id: string
  preferred_drinks: string[]
  other_preferences: string | null
  plus_one: boolean
  plus_one_name: string | null
}

export interface GuestDetailViewDto {
  id: string
  name: string
  is_already_answered: boolean
  guestForm: GuestFormDto | null
  response: GuestResponseViewDto | null
}

export type GuestRelationshipToCouple = 'bride_side' | 'groom_side' | 'mutual'
export type GuestAgeGroup = 'child' | 'young' | 'adult' | 'old'
export type GuestPersonalityType = 'introvert' | 'extrovert' | 'unknown'
export interface GuestCoupleStatusDto {
  response: boolean
  coupleId?: string
}

export interface GuestFormDto {
  relationship_to_couple: GuestRelationshipToCouple
  age_group: GuestAgeGroup
  has_kids_attending: boolean
  amount_of_kids: number | null
  personality_type: GuestPersonalityType
  vip_parents: boolean
  vip_grandparents: boolean
  vip_relatives: boolean
  ifWithCouple?: GuestCoupleStatusDto
}

export interface NewGuestPayload {
  guest_name: string
  guestForm?: GuestFormDto
}

export interface CreateGuestInputDto extends NewGuestPayload {
  user_id: number
}

export type UpdateGuestFormPayload = Partial<GuestFormDto>

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

  async updateGuestForm(id: string, dto: UpdateGuestFormPayload): Promise<GuestDetailViewDto> {
    const res = await apiFetch(`/guests/${id}/form`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deleteGuest(id: string): Promise<void> {
    const res = await apiFetch(`/guests/${id}`, { method: HttpMethod.DELETE })
    if (!res.ok) throw await parseApiError(res)
  },
}
