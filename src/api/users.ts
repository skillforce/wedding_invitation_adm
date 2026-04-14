import { apiFetch, parseApiError } from '@/api/consts'
import type { ProfileDto } from '@/api/auth'
import type { UpdateProfileDto } from '@/api/profile'

export interface UsersViewDto {
  id: number
  login: string
  profile: ProfileDto
}

export interface CreatePlainUserDto {
  login: string
  password: string
  email: string
}

export const USERS_API = {
  async getAll(): Promise<UsersViewDto[]> {
    const response = await apiFetch('/users')
    if (!response.ok) throw await parseApiError(response)
    return response.json()
  },

  async create(dto: CreatePlainUserDto): Promise<UsersViewDto> {
    const response = await apiFetch('/users/plain', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
    if (!response.ok) throw await parseApiError(response)
    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await apiFetch(`/users/${id}`, { method: 'DELETE' })
    if (!response.ok) throw await parseApiError(response)
  },

  async resendConfirmation(id: number): Promise<void> {
    const response = await apiFetch(`/users/${id}/resend-confirmation`, { method: 'POST' })
    if (!response.ok) throw await parseApiError(response)
  },

  async updateProfile(id: number, dto: UpdateProfileDto): Promise<ProfileDto> {
    const response = await apiFetch(`/users/${id}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
    if (!response.ok) throw await parseApiError(response)
    return response.json()
  },

  async uploadProfileImage(id: number, file: File): Promise<ProfileDto> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiFetch(`/users/${id}/profile/image`, {
      method: 'PATCH',
      body: formData,
    })
    if (response.status === 429) throw new Error('errors.userProfile.imageDailyLimit')
    if (!response.ok) throw await parseApiError(response)
    return response.json()
  },
}