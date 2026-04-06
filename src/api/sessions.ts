import { apiFetch, parseApiError } from '@/api/consts'

export interface AuthSessionDto {
  id: string
  deviceName: string | null
  lastActiveAt: string
  createdAt: string
  isCurrent: boolean
}

export const SESSIONS_API = {
  async getSessions(): Promise<AuthSessionDto[]> {
    const response = await apiFetch('/auth/sessions')
    if (!response.ok) {
      throw await parseApiError(response)
    }
    return response.json() as Promise<AuthSessionDto[]>
  },

  async deleteSession(id: string): Promise<void> {
    const response = await apiFetch(`/auth/sessions/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      throw await parseApiError(response)
    }
  },

  async deleteOtherSessions(): Promise<void> {
    const response = await apiFetch('/auth/sessions', { method: 'DELETE' })
    if (!response.ok) {
      throw await parseApiError(response)
    }
  },
}