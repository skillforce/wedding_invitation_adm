import { HttpMethod, apiFetch, parseApiError, qs } from '@/api/consts'

export interface ChecklistItemDto {
  id: string
  title: string
  note: string | null
  comment: string | null
  completed: boolean
  priority: 'high' | 'normal'
  sortOrder: number
}

export interface ChecklistPhaseDto {
  id: string
  name: string | null
  timeline: string | null
  icon: string | null
  sortOrder: number
  items: ChecklistItemDto[]
}

export interface ChecklistDto {
  id: string
  phases: ChecklistPhaseDto[]
}

export interface ChecklistItemCompletionDto {
  id: string
  completed: boolean
}

export interface CreatePhaseDto {
  name: string
  timeline?: string | null
  icon?: string | null
}

export interface PatchPhaseDto {
  name?: string | null
  timeline?: string | null
  icon?: string | null
}

export interface CreateItemDto {
  title: string
  note?: string | null
  priority?: 'high' | 'normal'
}

export interface PatchItemDto {
  title?: string
  note?: string | null
  comment?: string | null
  completed?: boolean
  priority?: 'high' | 'normal'
}

export interface MoveItemDto {
  itemId: string
  targetPhaseId: string
  targetIndex: number
}


export const CHECKLIST_API = {
  async getChecklist(locale: string, userId?: number): Promise<ChecklistDto> {
    const path = userId ? `/checklist?locale=${locale}&userId=${userId}` : `/checklist?locale=${locale}`
    const res = await apiFetch(path)
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async resetChecklist(locale: string): Promise<ChecklistDto> {
    const res = await apiFetch(`/checklist/reset?locale=${locale}`, { method: HttpMethod.POST })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async createPhase(dto: CreatePhaseDto, userId?: number): Promise<ChecklistPhaseDto> {
    const res = await apiFetch(`/checklist/phases${qs(userId)}`, {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async updatePhase(phaseId: string, dto: PatchPhaseDto, userId?: number): Promise<ChecklistPhaseDto> {
    const res = await apiFetch(`/checklist/phases/${phaseId}${qs(userId)}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deletePhase(phaseId: string, userId?: number): Promise<void> {
    const res = await apiFetch(`/checklist/phases/${phaseId}${qs(userId)}`, { method: HttpMethod.DELETE })
    if (!res.ok) throw await parseApiError(res)
  },

  async createItem(phaseId: string, dto: CreateItemDto, userId?: number): Promise<ChecklistItemDto> {
    const res = await apiFetch(`/checklist/phases/${phaseId}/items${qs(userId)}`, {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async updateItem(phaseId: string, itemId: string, dto: PatchItemDto, userId?: number): Promise<ChecklistItemDto> {
    const res = await apiFetch(`/checklist/phases/${phaseId}/items/${itemId}${qs(userId)}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async toggleItem(phaseId: string, itemId: string, userId?: number): Promise<ChecklistItemCompletionDto> {
    const res = await apiFetch(`/checklist/phases/${phaseId}/items/${itemId}/toggle${qs(userId)}`, {
      method: HttpMethod.PATCH,
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deleteItem(phaseId: string, itemId: string, userId?: number): Promise<void> {
    const res = await apiFetch(`/checklist/phases/${phaseId}/items/${itemId}${qs(userId)}`, {
      method: HttpMethod.DELETE,
    })
    if (!res.ok) throw await parseApiError(res)
  },

  async moveItem(dto: MoveItemDto, userId?: number): Promise<void> {
    const res = await apiFetch(`/checklist/items/move${qs(userId)}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
  },
}
