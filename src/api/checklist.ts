import { HttpMethod, apiFetch, parseApiError } from '@/api/consts'

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
  async getChecklist(locale: string): Promise<ChecklistDto> {
    const res = await apiFetch(`/checklist?locale=${locale}`)
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async resetChecklist(locale: string): Promise<ChecklistDto> {
    const res = await apiFetch(`/checklist/reset?locale=${locale}`, { method: HttpMethod.POST })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async createPhase(dto: CreatePhaseDto): Promise<ChecklistPhaseDto> {
    const res = await apiFetch('/checklist/phases', {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async updatePhase(phaseId: string, dto: PatchPhaseDto): Promise<ChecklistPhaseDto> {
    const res = await apiFetch(`/checklist/phases/${phaseId}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deletePhase(phaseId: string): Promise<void> {
    const res = await apiFetch(`/checklist/phases/${phaseId}`, { method: HttpMethod.DELETE })
    if (!res.ok) throw await parseApiError(res)
  },

  async createItem(phaseId: string, dto: CreateItemDto): Promise<ChecklistItemDto> {
    const res = await apiFetch(`/checklist/phases/${phaseId}/items`, {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async updateItem(phaseId: string, itemId: string, dto: PatchItemDto): Promise<ChecklistItemDto> {
    const res = await apiFetch(`/checklist/phases/${phaseId}/items/${itemId}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async toggleItem(phaseId: string, itemId: string): Promise<ChecklistItemCompletionDto> {
    const res = await apiFetch(`/checklist/phases/${phaseId}/items/${itemId}/toggle`, {
      method: HttpMethod.PATCH,
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deleteItem(phaseId: string, itemId: string): Promise<void> {
    const res = await apiFetch(`/checklist/phases/${phaseId}/items/${itemId}`, {
      method: HttpMethod.DELETE,
    })
    if (!res.ok) throw await parseApiError(res)
  },

  async moveItem(dto: MoveItemDto): Promise<void> {
    const res = await apiFetch('/checklist/items/move', {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
  },
}
