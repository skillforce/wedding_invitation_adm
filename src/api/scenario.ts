import { HttpMethod, apiFetch, parseApiError, qs } from '@/api/consts'
import type { ScenarioPoint, ScenarioPointIcon } from '@/types/scenario'

export interface ScenarioDto {
  id: string
  points: ScenarioPoint[]
}

export interface CreatePointDto {
  time: string
  title: string
  icon?: ScenarioPointIcon
  note?: string
  duration?: number
}

export interface PatchPointDto {
  time?: string
  title?: string
  icon?: ScenarioPointIcon
  note?: string | null
  duration?: number | null
}

export const SCENARIO_API = {
  async getScenario(userId?: number): Promise<ScenarioDto> {
    const path = userId ? `/scenario?userId=${userId}` : '/scenario'
    const res = await apiFetch(path)
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async seedScenario(locale: string): Promise<ScenarioDto> {
    const res = await apiFetch(`/scenario/seed?locale=${locale}`, { method: HttpMethod.POST })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async createPoint(dto: CreatePointDto, userId?: number): Promise<ScenarioDto> {
    const res = await apiFetch(`/scenario/points${qs(userId)}`, {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async updatePoint(pointId: string, dto: PatchPointDto, userId?: number): Promise<ScenarioPoint> {
    const res = await apiFetch(`/scenario/points/${pointId}${qs(userId)}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deletePoint(pointId: string, userId?: number): Promise<void> {
    const res = await apiFetch(`/scenario/points/${pointId}${qs(userId)}`, { method: HttpMethod.DELETE })
    if (!res.ok) throw await parseApiError(res)
  },
}