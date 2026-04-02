import { BASE_API_URL, apiFetch, parseApiError } from '@/api/consts'
import type { ProfileDto } from '@/api/auth'

export interface UpdateProfileDto {
  invitationUrl?: string | null
  weddingDate?: string | null
  phoneNumber?: string | null
  email?: string | null
}

export const PROFILE_API = {
  async updateProfile(data: UpdateProfileDto): Promise<ProfileDto> {
    const response = await apiFetch('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }

    return response.json() as Promise<ProfileDto>
  },

  async uploadProfileImage(file: File): Promise<ProfileDto> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('errors.auth.unauthorized')

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${BASE_API_URL}/users/profile/image`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    if (response.status === 401) throw new Error('errors.auth.unauthorized')
    if (response.status === 422) throw new Error('errors.userProfile.imageRejected')
    if (response.status === 429) throw new Error('errors.userProfile.imageDailyLimit')
    if (!response.ok) throw await parseApiError(response)

    return response.json() as Promise<ProfileDto>
  },
}